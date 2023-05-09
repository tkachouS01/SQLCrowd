import SolutionsController from '../controllers/solutionsController.js';
import solutionAccessControl from '../middleware/SolutionAccessControl.js'
import checkSolutionExists from '../middleware/checkSolutionExists.js'
import express from 'express';
const solutionsRouter = new express.Router({ mergeParams: true });
const solutionsController = new SolutionsController();
solutionsRouter.param('solution_id', checkSolutionExists);
solutionsRouter.route('/')
    .get(solutionAccessControl, solutionsController.getSolutions.bind(solutionsController)) //+
    .post(solutionsController.createSolutionTask.bind(solutionsController)); //+
solutionsRouter.route('/:solution_id')
    .get(solutionAccessControl, solutionsController.getOneSolution.bind(solutionsController)) //+
    .patch(solutionsController.updateSolutionTask.bind(solutionsController)); //+
solutionsRouter.route('/:solution_id/like')
    .post(solutionAccessControl, solutionsController.likeSolution.bind(solutionsController));
solutionsRouter.route('/:solution_id/comment')
    .post(solutionAccessControl, solutionsController.addCommentSolution.bind(solutionsController))
export default solutionsRouter;