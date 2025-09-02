const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  broadcastCount();

  ws.on('close', () => {
    clients.delete(ws);
    broadcastCount();
  });
});

function broadcastCount() {
  const message = JSON.stringify({ count: clients.size });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
