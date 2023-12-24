import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';
import {
    addRoom,
    addUserToRoom,
    getRoom,
    removeUserFromRoom
} from './store/rooms.js';
import getQuestions from './utils/getQuestions.js';

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
        const room = addRoom({ id: randomUUID() });
        socket.emit('lobbyCreated', room.id);
    });

    socket.on('checkRoom', roomId => {
        const room = getRoom(roomId);
        const roomExists = room;
        socket.emit('roomExists', roomExists);
    });

    socket.on('joinLobby', ({ roomId, name }) => {
        const user = addUserToRoom({ roomId, name, id: socket.id });

        if (user.error) {
            socket.emit('error', user.error);
            return;
        }

        socket.join(roomId);
        socket.emit('playerInfo', user.user);

        io.to(roomId).emit('updateLobby', getRoom(roomId).users);
    });

    socket.on('leaveLobby', ({ roomId }) => {
        const room = getRoom(roomId);

        const users = room?.users;

        removeUserFromRoom(socket.id);

        if (room && users) {
            io.to(roomId).emit('updateLobby', users);
        }

        socket.leave(roomId);
    });

    socket.on('startGame', ({ roomId }) => {
        let room = getRoom(roomId);

        if (!room) return;

        io.to(roomId).emit('gameStarted');
        io.to(roomId).emit('updateLobby', room.users);

        sendQuestions(roomId);

        setTimeout(() => {
            io.to(roomId).emit('gameEnded');
        }, 10000);
    });

    socket.on('disconnect', () => {
        removeUserFromRoom(socket.id);

        // TODO: remove room if no users

        console.log('Client disconnected', socket.id);
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});

const sendQuestions = roomId => {
    const room = getRoom(roomId);

    if (!room) return;

    const normalQuestions = getQuestions()[0];
    const imposterQuestion = getQuestions()[1];

    const imposterIndex = Math.floor(Math.random() * room.users?.length);

    let playerIndex = 0;

    io.in(roomId)
        .fetchSockets()
        .then(sockets => {
            sockets.forEach(socket => {
                const question =
                    playerIndex === imposterIndex
                        ? imposterQuestion
                        : normalQuestions;
                socket.emit('question', question);
                playerIndex++;
            });
        })
        .catch(err => {
            console.log(err);
        });
};
