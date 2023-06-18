import express from "express";
import TestController from "../../controllers/testController.js";

const testRouter = new express.Router({mergeParams: true});
const testController = new TestController();

testRouter.route('/about-test')
    .get(testController.getInfoAboutTest.bind(testController));
testRouter.route('/make-available')
    .patch(testController.makeAvailableTest.bind(testController));

testRouter.route('')
    .get(testController.getOneTest.bind(testController))
    .post(testController.addAnswer.bind(testController))
    .patch(testController.updateTest.bind(testController));

testRouter.route('/:userId')
    .get(testController.getOneTest.bind(testController));



export default testRouter;