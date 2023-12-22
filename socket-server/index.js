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

            // Create the player object
            const playerObject = {
                id: socket.id,
                name: name,
                host: isFirstPlayer // The first player becomes the host
            };

            // Add the player to the room
            rooms[roomId][socket.id] = playerObject;

            // Join the room
            socket.join(roomId);

            // Emit the player's own object back to them
            socket.emit('playerInfo', playerObject);

            // Emit updated lobby information to all players in the room
            io.to(roomId).emit('updateLobby', Object.values(rooms[roomId]));
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

    socket.on('startGame', ({ roomId }) => {
        if (rooms[roomId]) {
            io.to(roomId).emit('gameStarted');

            sendQuestions(roomId);
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

const sendQuestions = roomId => {
    const normalQuestions =
        'Wer würde am ehesten einen Tag ohne Smartphone überleben?';

    const imposterQuestion =
        'Wer ist am wahrscheinlichsten ein geheimes Doppelleben zu führen?';

    const imposterIndex = Math.floor(
        Math.random() * Object.keys(rooms[roomId]).length
    );

    let playerIndex = 0;

    io.in(roomId)
        .fetchSockets()
        .then(sockets => {
            sockets.forEach(socket => {
                const question =
                    playerIndex === imposterIndex
                        ? imposterQuestion
                        : normalQuestions;
                socket.to(socket.id).emit('question', question);
                playerIndex++;
            });
        })
        .catch(err => {
            console.log(err);
        });

    // io.in(roomId).clients((error, clients) => {
    //     if (error) throw error;

    //     clients.forEach(clientId => {
    //         const question =
    //             playerIndex === imposterIndex
    //                 ? imposterQuestion
    //                 : normalQuestions;
    //         io.to(clientId).emit('question', question);
    //         playerIndex++;
    //     });
    // });
};
