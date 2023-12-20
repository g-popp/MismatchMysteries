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

            // Check if this is the first player in the lobby
            const isFirstPlayer = Object.keys(rooms[roomId]).length === 0;

            rooms[roomId][socket.id] = {
                id: socket.id,
                name: name,
                host: isFirstPlayer // The first player becomes the host
            };

            // Emit updated lobby information to all players in the room
            io.to(roomId).emit('updateLobby', Object.values(rooms[roomId]));
            console.log(rooms[roomId]);
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });

    socket.on('disconnect', () => {
        Object.keys(rooms).forEach(roomId => {
            if (rooms[roomId][socket.id]) {
                // Check if the disconnecting player is the host
                const isHost = rooms[roomId][socket.id].host;

                delete rooms[roomId][socket.id];

                // Check if there are any players left in the room
                if (Object.keys(rooms[roomId]).length === 0) {
                    // If no players left, delete the room
                    delete rooms[roomId];
                } else if (isHost) {
                    // If the host left and there are still players, assign the host role to the next player
                    const nextPlayerId = Object.keys(rooms[roomId])[0];
                    rooms[roomId][nextPlayerId].host = true;
                    // Emit updated lobby information to all players in the room
                    io.to(roomId).emit(
                        'updateLobby',
                        Object.values(rooms[roomId])
                    );
                }
            }
        });
        console.log('Client disconnected', socket.id);
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});
