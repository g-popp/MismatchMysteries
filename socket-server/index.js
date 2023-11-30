import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

io.on('connection', () => {
    console.log('a user connected');
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});
