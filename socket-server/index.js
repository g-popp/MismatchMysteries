import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';
import {
    addPlayerBlame,
    addPlayerChoice,
    haveAllPlayersBlamed,
    haveAllPlayersChosen
} from './store/game.js';
import {
    addRoom,
    addUserToRoom,
    getRoom,
    getRoomFromUser,
    makeUserImposter,
    removeUserFromRoom
} from './store/rooms.js';
import getQuestions from './utils/getQuestions.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
    cors: {
        origin: '*'
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

        const newUserList = removeUserFromRoom(socket.id);

        socket.leave(roomId);

        if (!users) return;

        io.to(roomId).emit('updateLobby', newUserList);
    });

    socket.on('startGame', ({ roomId }) => {
        makeUserImposter(roomId);

        const room = getRoom(roomId);

        io.to(roomId).emit('gameStarted');
        io.to(roomId).emit('updateLobby', room.users);

        sendQuestions(roomId);
    });

    socket.on('choosePlayer', ({ playerId }) => {
        const updatedChoice = addPlayerChoice(socket.id, playerId);

        if (updatedChoice.error) {
            socket.emit('error', updatedChoice.error);
            return;
        }

        const room = getRoomFromUser(socket.id);

        if (!room) return;

        if (haveAllPlayersChosen(room.id)) {
            io.to(room.id).emit('allPlayersChosen');
            console.log("All players have chosen, let's go!");
        }
    });

    socket.on('blamePlayer', ({ playerId }) => {
        const choice = addPlayerBlame(socket.id, playerId);

        if (choice.error) {
            socket.emit('error', choice.error);
            return;
        }

        const room = getRoomFromUser(socket.id);

        if (!room) return;

        if (haveAllPlayersBlamed(room.id)) {
            io.to(room.id).emit('allPlayersBlamed');
            console.log("All players have blamed, let's go!");
        }
    });

    socket.on('startDiscussionPhase', () => {
        const room = getRoomFromUser(socket.id);

        if (!room) return;

        io.to(room.id).emit('discussionPhaseStarted');
    });

    socket.on('disconnect', () => {
        removeUserFromRoom(socket.id);

        // TODO: remove room if no users

        console.log('Client disconnected', socket.id);
    });

    socket.on('startBlamePhase', () => {
        const room = getRoomFromUser(socket.id);

        if (!room) return;

        io.to(room.id).emit('blamePhaseStarted');
    });
});

server.listen(PORT, () => {
    console.log('server running on port', PORT);
});

const sendQuestions = roomId => {
    const room = getRoom(roomId);

    if (!room) return;

    const normalQuestion = getQuestions()[0];
    const imposterQuestion = getQuestions()[1];

    if (!normalQuestion || !imposterQuestion) return;

    io.to(roomId).emit('questions', { normalQuestion, imposterQuestion });
};
