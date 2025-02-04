import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

console.log('Backend - Starting up...');

// Take configuration from environment variables
// or use hardcoded default value
const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.BINDADDRESS || '0.0.0.0';

const app = express();

app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use(cookieParser());

function logRequestMiddleWare(req, res, next) {
    let now = new Date();
    let trackingId = req.cookies['tracking-id'];

    if (!trackingId) {
        trackingId = crypto.randomUUID();
        res.cookie('tracking-id', trackingId);
    }
    
    console.log(` ${now.toISOString()} ${trackingId} ${req.method} ${req.url}`);
    next();
}


app.use(logRequestMiddleWare);
app.use(express.static('wwwRoot'));

// create HTTP server
const httpServer = http.createServer(app);

// start listening to HTTP requests
httpServer.listen(PORT, HOSTNAME, () => {
    console.log(`Backend - Running on port ${PORT}...`);
});

export default httpServer;
