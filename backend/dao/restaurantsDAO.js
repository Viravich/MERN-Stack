import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;
let restaurants;

export default class RestaurantsDAO {
  // method our server start to get ref restaurants db
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (error) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${error}`
      );
    }
  }

  // method get all restaurants db
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    // method check to search something in query depend on filters
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }
    // find all restaurants
    let cursor;
    try {
      cursor = await restaurants.find(query);
    } catch (error) {
      console.error(`Unable to issue find command: ${error}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    // display to show restaurants per page
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    // set array restaurantsList & totalNumRestaurants, then to return arrays
    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);
      return { restaurantsList, totalNumRestaurants };
    } catch (error) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${error}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  // method get restaurants by id
  static async getRestaurantsByID(id) {
    try {
      // match different collections together
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          // loop up is only one path of aggregation pipeline frameworks data

          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            // pipeline to match restaurantsId reviews
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            // set reviews results list
            as: "reviews",
          },
        },
        {
          // add a field od reviews to new results
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      // collect all results ro return the next items restaurants
      return await restaurants.aggregate(pipeline).next();
    } catch (error) {
      console.error(`Something went wrong in getRestaurantsByID: ${error}`);
      throw error;
    }
  }

  // method get each cuisine from restaurants all
  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (error) {
      console.error(`Unable to get cuisines, ${error}`);
      return cuisines;
    }
  }
}
