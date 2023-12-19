import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

const { randomUUID } = new ShortUniqueId({ length: 8 });

let rooms = {};

io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on('createLobby', () => {
        let roomId = randomUUID();
        rooms[roomId] = {};
        socket.join(roomId);
        socket.emit('lobbyCreated', roomId);
    });

    socket.on('checkRoom', roomId => {
        if (rooms[roomId]) {
            socket.emit('roomExists', true);
        } else {
            socket.emit('roomExists', false);
        }
    });

    socket.on('joinLobby', ({ roomId, name }) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            rooms[roomId][socket.id] = { id: socket.id, name: name };
            io.to(roomId).emit('updateLobby', Object.values(rooms[roomId]));
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });

    socket.on('disconnect', () => {
        // Remove the user from the room and update other members
        Object.keys(rooms).forEach(roomId => {
            if (rooms[roomId][socket.id]) {
                delete rooms[roomId][socket.id];
                io.to(roomId).emit('updateLobby', Object.keys(rooms[roomId]));
            }
        });
        console.log('Client disconnected', socket.id);
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});
