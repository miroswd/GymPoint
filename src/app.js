import express from 'express';

import './database';

// Sentry
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors';

import routes from './routes';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json()); // Leitura de JSON
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }
}

export default new App().server; // Exportando a variável server
