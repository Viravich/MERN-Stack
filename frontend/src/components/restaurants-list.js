import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = (props) => {
  // react hook state variables
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  // react hook component need something
  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  // refreshList info
  const refreshList = () => {
    retrieveRestaurants();
  };

  // hook to getAll restaurants info
  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch((error) => {
        console.log({ error: error.message });
      });
  };

  // hook to get cuisines info
  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then((response) => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch((error) => {
        console.log({ error: error.message });
      });
  };

  // search bar to onChange search name
  const onChangeSearchName = (event) => {
    const searchName = event.target.value;
    setSearchName(searchName);
  };

  // search bar to onChange search zip code
  const onChangeSearchZip = (event) => {
    const searchZip = event.target.value;
    setSearchZip(searchZip);
  };

  // search bar to onChange search cuisines
  const onChangeSearchCuisines = (event) => {
    const searchCuisine = event.target.value;
    setSearchCuisine(searchCuisine);
  };

  // find to call each function find name, zip, cuisines on query
  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch((error) => {
        console.log({ error: error.message });
      });
  };

  // find function name of search something
  const findByName = () => {
    find(searchName, "name");
  };

  // find function zip code of search something
  const findByZip = () => {
    find(searchZip, "zipcode");
  };

  // find function cuisines of search something
  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine");
    }
  };

  return (
    <div className="container">
      <div className="row d-flex pb-2">
        <div className="input-group w-auto col-lg-4 me-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group w-auto col-lg-4 me-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip code"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group w-auto col-lg-4 me-auto">
          <select onChange={onChangeSearchCuisines}>
            {cuisines.map((cuisineData) => {
              return (
                <option value={cuisineData}>
                  {cuisineData.substring(0, 20)}
                </option>
              );
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {restaurants.map((restaurantData) => {
          const address = `${restaurantData.address.building} ${restaurantData.address.street}, ${restaurantData.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurantData.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurantData.cuisine}
                  </p>
                  <p className="card-text">
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div className="row">
                    <Link
                      to={"/restaurants/" + restaurantData._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Reviews
                    </Link>
                    <a
                      target="_blank"
                      href={"https://www.google.com/maps/place/" + address}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantsList;
