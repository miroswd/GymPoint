import { Router } from 'express';

// Importando controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Importando middlewares
import AuthMiddlewares from './app/middlewares/auth';

const routes = new Router();

/* Teste com model

import Students from './app/models/Students';

routes.get('/testemodel', async (req, res) => {
  const student = await Students.create({
    name: 'Miroswd',
    email: 'miroswd@email.com',
    age: 19,
    height: 1.75,
    weight: 70,
  });
  return res.json(student);
}); */

routes.post('/session', SessionController.store);

routes.use(AuthMiddlewares);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
