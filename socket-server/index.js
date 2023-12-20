import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:4173']
    }
});

const { randomUUID } = new ShortUniqueId({ length: 8 });

let rooms = {};

io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on('createLobby', () => {
        let roomId = randomUUID();
        rooms[roomId] = {};
        // socket.join(roomId);
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
            // Determine if this is the first player in the lobby
            const isFirstPlayer = Object.keys(rooms[roomId]).length === 0;

            console.log(isFirstPlayer);

            // Add the player to the room
            rooms[roomId][socket.id] = {
                id: socket.id,
                name: name,
                host: isFirstPlayer // The first player becomes the host
            };

            // Join the room
            socket.join(roomId);

            // Emit updated lobby information to all players in the room
            io.to(roomId).emit('updateLobby', Object.values(rooms[roomId]));
            console.log(rooms[roomId]);
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });

    socket.on('leaveLobby', ({ roomId }) => {
        if (rooms[roomId]) {
            socket.leave(roomId);
            delete rooms[roomId][socket.id];
            io.to(roomId).emit('updateLobby', Object.values(rooms[roomId]));
        }
    });

    socket.on('disconnect', () => {
        Object.keys(rooms).forEach(roomId => {
            if (rooms[roomId][socket.id]) {
                const isHost = rooms[roomId][socket.id].host;
                delete rooms[roomId][socket.id];

                if (Object.keys(rooms[roomId]).length === 0) {
                    delete rooms[roomId];
                } else {
                    if (isHost) {
                        const nextPlayerId = Object.keys(rooms[roomId])[0];
                        rooms[roomId][nextPlayerId].host = true;
                    }
                    // Ensure the room still exists before emitting the event
                    if (rooms[roomId]) {
                        io.to(roomId).emit(
                            'updateLobby',
                            Object.values(rooms[roomId])
                        );
                    }
                }
            }
        });
        console.log('Client disconnected', socket.id);
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});
