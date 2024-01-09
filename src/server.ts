import { ENVIRONMENT } from './common/configs/environment';
import './common/interfaces/authRequest'
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import AppError from './common/utils/appError';
import api from './api';
import rateLimit from 'express-rate-limit';
import { handleError } from './common/utils/errorHandler';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import compression from 'compression';
import { stream } from './common/utils/logger';
import morgan from 'morgan';
import { AppResponse } from './common/utils/appResponse';
import { initializeDB } from './common/configs/db';
import { catchAsync } from './common/utils/catchAsync';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
/**
 * Default app configurations
 */
const app = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

/**
 * App Security
 */
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');
const timeoutMiddleware = timeout(60000);
// app.use(compression);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

/**
 * Logger Middleware
 */
app.use(
  morgan(ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream })
);

// append request time to all request
app.use((req, res, next) => {
  req['requestTime'] = new Date().toISOString();
  next();
});

/**
 * Initialize routes
 */
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.all(
  '*',
  catchAsync(async (req: Request) => {
    throw new AppError('route not found', 404);
  })
);

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(handleError);

/**
 * status check
 */
app.get('*', (req, res) =>
  res.send({
    Time: new Date(),
    status: 'running'
  })
);

app.post(
  '/webhooks',
  catchAsync(async (req: Request, res: Response) => {
    const hash = crypto
      .createHmac('sha512', ENVIRONMENT.DB.URL)
      .update(JSON.stringify(req.body))
      .digest('hex');
    console.log(req.headers['X-Bloc-Webhook']);
    if (hash !== req.headers['X-Bloc-Webhook'])
      throw new AppError('The bloc hash is invalid', 400);
    const event = req.body;
    return AppResponse(res, 200, event, 'Webhook retrieval successful');
  })
);

/**
 * Bootstrap server
 */
app.listen(port, () => {
  console.log('=> ' + appName + ' app listening on port ' + port + '!');
  initializeDB();
});
