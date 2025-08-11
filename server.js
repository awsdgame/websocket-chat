const http = require('http');
const WebSocketServer = require('ws').Server;
const PORT = process.env.PORT || 3000;

// Create a basic HTTP server (so Railway can connect)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running\n');
});

// Attach WebSocket to HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('New client connected');

    ws.on('message', message => {
        console.log(`Received: ${message}`);
        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
