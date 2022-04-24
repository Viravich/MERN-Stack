import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
dotenv.config();

// get  to our mongodb
const MongoClient = mongodb.MongoClient;

// set port from env
const port = process.env.PORT || 8000;

// connect to db
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((error) => {
    console.error(error.stack);
    process.exit(1);
  })
  .then(async (client) => {
    // initial ref to restaurants collection in db and create controller routes to use access DAO
    await RestaurantsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening port ${port}`);
    });
  });
