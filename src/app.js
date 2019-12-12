import express from 'express';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // Leitura de JSON
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // Exportando a variável server
