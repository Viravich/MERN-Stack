import http from "../http-common";

class RestaurantDataService {
  // get all restaurants
  getAll(page = 0) {
    return http.get(`?page=${page}`);
  }

  // get by id restaurant
  getById(id) {
    return http.get(`/id/${id}`);
  }

  // find to get by name/cuisines/zipcode on query
  find(query, by = "name", page = 0) {
    return http.get(`?${by}=${query}&?page=${page}`);
  }

  // create new reviews
  createReview(data) {
    return http.post("/review", data);
  }

  //update reviews
  updateReview(data) {
    return http.patch("/review", data);
  }

  //delete reviews
  deleteReview(id) {
    return http.delete(`/review?id=${id}`);
  }

  // get by id cuisines
  getCuisines(id) {
    return http.get(`/cuisines`);
  }
}

export default new RestaurantDataService();
