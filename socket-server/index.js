import express from 'express';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

let rooms = {};

io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on('createLobby', () => {
        let roomId = randomUUID();
        rooms[roomId] = {};
        socket.join(roomId);
        socket.emit('lobbyCreated', roomId);
    });

    socket.on('joinLobby', roomId => {
        if (rooms[roomId]) {
            socket.join(roomId);
            rooms[roomId][socket.id] = {};
            io.to(roomId).emit('updateLobby', Object.keys(rooms[roomId]));
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});
