import express, { Application, Request, Response, NextFunction } from 'express';
import { createUser, deleteUserById } from './controllers/UserController.js';
import { birthdayCheckerController } from './controllers/BirthdayController.js';
import logger from './middleware/logger.js';

const app: Application = express();

// Middleware: parse body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware: logging
app.use(logger);

// Middleware: strip stage prefix like "/dev"
app.use((req: Request, res: Response, next: NextFunction) => {
  const stage = process.env.STAGE || 'dev';
  const prefix = `/${stage}`;
  
  if (req.url.startsWith(prefix)) {
    req.url = req.url.slice(prefix.length) || '/';
  }

  next();
});

// Routes
app.post('/user', createUser);
app.delete('/user/:id', deleteUserById);
app.get('/birthdayCheckerAndQueue', birthdayCheckerController);

export default app;