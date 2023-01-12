/* eslint quotes: off */

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as compression from 'compression';
import * as cors from 'cors';
import * as http from 'http';
import * as path from 'path';
import helmet from 'helmet';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import * as helpers from './helpers';
import api from './api';

// -------------------------------------------------------------------------- //
// Express setup
// -------------------------------------------------------------------------- //
const env = process.env.NODE_ENV || 'production';
const port = helpers.normalizePort(process.env.PORT || '8080');
const app = express();

app.set('port', port);
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': [
        "'self'",
        'blob:',
        'data:',
        'https://www.google-analytics.com',
      ],
      'connect-src': [
        "'self'",
        'https://repo-prod.prod.sagebase.org',
        'https://vimeo.com/',
        'https://www.google-analytics.com',
        'https://fonts.gstatic.com',
        'https://api.rollbar.com',
      ],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      'frame-src': ['https://player.vimeo.com/', 'https://docs.google.com'],
    },
  })
);

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

if (env === 'development') {
  console.log('ENV:', env);
  console.log('PORT:', port);
}

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// -------------------------------------------------------------------------- //
// Error handling
// -------------------------------------------------------------------------- //

if (app.get('env') === 'development') {
  // Development: will print stacktrace
  app.use((err: any, req: Request, res: Response) => {
    res.status(err.status || 500);
    res.json({
      message: err.message || '',
      error: err,
    });
  });
} else {
  // Production: no stacktraces leaked to user
  app.use((err: any, req: Request, res: Response) => {
    res.status(err.status || 500);
    res.json({
      message: err.message || '',
      error: {},
    });
  });
}

//http to https redirects
app.get('/', (req: Request, res: Response) => {
  if (req.protocol == 'http') {
    res.redirect('https://' +
    req.get('host') + req.originalUrl);
  }
});

// -------------------------------------------------------------------------- //
// Server
// -------------------------------------------------------------------------- //
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
server.on('error', (err) => helpers.onError(err, port));
server.on('listening', () => helpers.onListening(server.address()));

// -------------------------------------------------------------------------- //
// Export
// -------------------------------------------------------------------------- //
export { app };
