import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const logger = (req: Request, res:Response, next:NextFunction) => {
  type ChalkFunction = (text: string) => string;

  const methodColors: Record<string, ChalkFunction> = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
  };
  const colorFn = methodColors[req.method] || chalk.white;

  const logMessage = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`;

  console.log(colorFn(logMessage));

  next();
};

export default logger;
