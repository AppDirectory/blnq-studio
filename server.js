#!/usr/bin/env node
/*THIS IS A COPY OF THE y-websocket/bin/server.js with the addition of let app = require('./http-server');*/
const WebSocket = require('ws');
const http = require('http');
const wss = new WebSocket.Server({ noServer: true });
const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection;
let app = require('./http-server');

const port = process.env.PORT || '8080';

const server = http.createServer();

server.on('request', app);

wss.on('connection', function setupWSConnection(ws) {});

server.on('upgrade', (request, socket, head) => {
    const handleAuth = (ws) => {
        wss.emit('connection', ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port);
