import express from 'express';
const solutionsRouter = new express.Router({ mergeParams: true });
import SolutionsController from '../controllers/solutionsController.js';
import solutionAccessControl from '../middleware/SolutionAccessControl.js'
import checkSolutionExists from '../middleware/checkSolutionExists.js'
const solutionsController = new SolutionsController();



solutionsRouter.param('solution_id', checkSolutionExists);

solutionsRouter.route('/')
    //получить все решения задачи
    .get(solutionAccessControl, solutionsController.getSolutions.bind(solutionsController)) //+
    //создать решение к конкретной задаче
    .post(solutionsController.createSolutionTask.bind(solutionsController)); //+

solutionsRouter.route('/:solution_id')
    //получить конкретное решение задачи
    .get(solutionAccessControl, solutionsController.getOneSolution.bind(solutionsController)) //+
    //обновить конкретное решение
    .patch(solutionsController.updateSolutionTask.bind(solutionsController)); //+

solutionsRouter.route('/:solution_id')
    //получить конкретное решение задачи
    .get(solutionAccessControl, solutionsController.getOneSolution.bind(solutionsController)) //-
    //обновить конкретное решение
    .patch(solutionsController.updateSolutionTask.bind(solutionsController)); //-


solutionsRouter.route('/:solution_id/like')
    //лайкнуть решение
    .post(solutionAccessControl, solutionsController.likeSolution.bind(solutionsController));

solutionsRouter.route('/:solution_id/comment')
    //добавить комментарий к решению
    .post(solutionAccessControl, solutionsController.addCommentSolution.bind(solutionsController))


export default solutionsRouter;