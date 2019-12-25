import 'dotenv/config';

import express from 'express';
import 'express-async-errors';

import Youch from 'youch';

// Sentry
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

import routes from './routes';

import './database';

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

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const error = await new Youch(err, req).toJSON();

        return res.status(500).json(error);
      }
      return res.stastus(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server; // Exportando a variável server
