import { Router } from 'express';

// Importando controllers
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderAnswerController from './app/controllers/HelpOrderAnswerController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Importando middlewares
import AuthMiddlewares from './app/middlewares/auth';

const routes = new Router();

// Admin login
routes.post('/session', SessionController.store);

// Student question
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);

// Requires Auth
routes.use(AuthMiddlewares);

// Create
routes.post('/checkins/:id', CheckinController.store);
routes.post('/plan', PlanController.store);
routes.post('/register', RegisterController.store);
routes.post('/students', StudentController.store);

// Read
routes.get('/plans', PlanController.index);
routes.get('/unanswered/questions', HelpOrderAnswerController.index);
routes.get('/plan/:id', PlanController.show);
routes.get('/registers', RegisterController.index);

// Read only
routes.get('/register/:id', RegisterController.show);
routes.get('/students', StudentController.index);
routes.get('/student/:id', StudentController.show);

// Update
routes.put('/help-orders/:id/answer', HelpOrderAnswerController.update); // Question id
routes.put('/plan/:id/update', PlanController.update);
routes.put('/register/:id', RegisterController.update);
routes.put('/students/:id', StudentController.update);

// Delete
routes.delete('/plan/:id/delete', PlanController.delete);
routes.delete('/register/:id/delete', RegisterController.delete);

export default routes;
