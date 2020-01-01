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

// Student
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.get('/student/:id', StudentController.show);
routes.put('/student/:id', StudentController.update);
routes.delete('/delete/student/:id', StudentController.delete);

// Plan
routes.post('/plan', PlanController.store);
routes.get('/plans', PlanController.index);
routes.get('/plan/:id', PlanController.show);
routes.put('/plan/:id/update', PlanController.update);
routes.delete('/plan/:id/delete', PlanController.delete);

// Register
routes.post('/register', RegisterController.store);
routes.get('/registers', RegisterController.index);
routes.get('/register/:id', RegisterController.show);
routes.put('/register/:id', RegisterController.update);
routes.delete('/register/:id/delete', RegisterController.delete);

// Checkin
routes.post('/checkin/:id', CheckinController.store);

// Answer
routes.get('/unanswered/questions', HelpOrderAnswerController.index);
routes.put('/help-orders/:id/answer', HelpOrderAnswerController.update); // Question id

export default routes;
