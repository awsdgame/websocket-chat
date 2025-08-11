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

let messageHistory = [];

wss.on('connection', ws => {
    // Send chat history to new client
    ws.send(JSON.stringify({ type: 'history', data: messageHistory }));

    ws.on('message', msg => {
        const data = msg.toString();
        messageHistory.push(JSON.parse(data)); // store message
        // Keep only last 50 messages
        if (messageHistory.length > 50) messageHistory.shift();

        // Broadcast to everyone
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
