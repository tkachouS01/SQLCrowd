import express from "express";
import RatingController from "../controllers/ratingController.js";

const ratingController = new RatingController()
const ratingRouter = new express.Router({mergeParams: true});

ratingRouter.route('')
    .get(ratingController.getRating.bind(ratingController))

export default ratingRouter;