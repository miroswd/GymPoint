import { Router } from 'express';

// Importando controllers
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Importando middlewares
import AuthMiddlewares from './app/middlewares/auth';

const routes = new Router();

// Auth
routes.post('/session', SessionController.store);
routes.use(AuthMiddlewares);

// Create
routes.post('/plan', PlanController.store);
routes.post('/students', StudentController.store);

// Read
routes.get('/plans', PlanController.index);
routes.get('/plan/:id', PlanController.show);

// Update
routes.put('/plan/:id/update', PlanController.update);
routes.put('/students/:id', StudentController.update);

// Delete
routes.delete('/plan/:id/delete', PlanController.delete);

export default routes;
