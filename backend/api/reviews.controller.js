import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  // post request to get info from body query parameters
  static async apiPostReview(req, res, next) {
    try {
      const restaurantId = req.body.restaurant_id;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      // put the all info to reviewResponse
      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      );
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // update request to update info from body query params
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();

      // update and put all info to reviewResponse
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      );
      // check error status
      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }
      // check modified count review
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update review - user may not be original poster"
        );
      }
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // delete request to delete info by reviewId/userId on query parameters
  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id;
      console.log(reviewId);

      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
