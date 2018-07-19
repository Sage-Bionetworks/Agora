/**
 * Module dependencies.
 */

import * as compression from 'compression';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as http from 'http';
import * as helmet from 'helmet';
import * as debug from 'debug';

// Get our api routes
import api from './routes/api';

debug('agora:server');

const env = (process.env.mode || process.env.NODE_ENV || process.env.ENV || 'development');
const app: express.Express = express();

// We are behind a proxy now so set a trsut proxy variable here
// http://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.use(compression());
app.use(cors());

app.use(helmet());

// Serve static files from public folder
app.use(express.static(__dirname));

// Parse application/json
app.use(bodyParser.json({limit: '50mb'}));
// For parsing application/x-www-form-unlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

// Adding this condition because UglifyJS can't handle ES2015, only needed for the server
if (env === 'development') {
    console.log('NODE_ENV: ', process.env.NODE_ENV);
    console.log('PORT: ', process.env.PORT);
    console.log('Docker: ', process.env.Docker);
}

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));

server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    const tPort = parseInt(val, 10);

    if (isNaN(tPort)) {
        // named pipe
        return val;
    }

    if (tPort >= 0) {
        // port number
        return tPort;
    }

    return false;
}

// Event listener for HTTP server "error" event
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
        default:
        throw error;
    }
}

// Event listener for HTTP server "listening" event
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

export { app };
