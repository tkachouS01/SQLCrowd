import SolutionsController from '../../controllers/solutionsController.js';
import solutionAccessControl from '../../middleware/SolutionAccessControl.js'
import checkSolutionExists from '../../middleware/checkSolutionExists.js'
import express from 'express';

const solutionsRouter = new express.Router({mergeParams: true});
const solutionsController = new SolutionsController();
solutionsRouter.param('solutionId', checkSolutionExists);
solutionsRouter.route('/')
    .get(solutionAccessControl, solutionsController.getSolutions.bind(solutionsController))
    .post(solutionsController.createSolutionTask.bind(solutionsController));
solutionsRouter.route('/:solutionId')
    .get(solutionsController.getOneSolution.bind(solutionsController))
    .patch(solutionsController.updateSolutionTask.bind(solutionsController));


solutionsRouter.route('/:solutionId/like')
    .post(solutionAccessControl, solutionsController.likeSolution.bind(solutionsController));
solutionsRouter.route('/:solutionId/comment')
    .post(solutionAccessControl, solutionsController.addCommentSolution.bind(solutionsController))


solutionsRouter.route('/:solutionId/finished')
    .patch(solutionsController.finishTheSolution.bind(solutionsController));


export default solutionsRouter;