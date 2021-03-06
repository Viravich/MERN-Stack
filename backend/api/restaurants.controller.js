import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  // get all restaurants
  static async apiGetRestaurants(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    // call get restaurants to create before filters, page, restaurantsPerPage & to return restaurantsList, totalNumRestaurants
    const { restaurantsList, totalNumRestaurants } =
      await RestaurantsDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
      });

    // create response to send all response anf to show json response
    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    res.json(response);
  }

  // get restaurants by id
  static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {};
      let restaurant = await RestaurantsDAO.getRestaurantsByID(id);
      if (!restaurant) {
        res.status(404).json({ error: "Not Found" });
        return;
      }
      res.json(restaurant);
    } catch (error) {
      console.log(`api, ${error}`);
      res.status(500).json({ error: error });
    }
  }

  // get all cuisines
  static async apiGetRestaurantsCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines();
      res.json(cuisines);
    } catch (error) {
      console.log(`api, ${error}`);
      res.status(500).json({ error: error });
    }
  }
}
