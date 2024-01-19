import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
    clearForNewGame,
    getPlayerChoices,
    haveAllPlayersBlamed,
    haveAllPlayersChosen,
    revealMismatch,
    updatePlayerChoice,
    updatedPlayerBlame
} from './store/game.js';
import { sendQuestions } from './store/questions.js';
import {
    getRoom,
    getRoomFromUser,
    makeUserImposter,
    removeUserFromRoom
} from './store/rooms.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*'
    },
    transports: ['polling', 'websocket'],
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000
    }
});

const connections = {};
const users = {};
const rooms = {};

const { randomUUID: generateRoomId } = new ShortUniqueId({
    length: 8,
    dictionary: 'alphanum_lower'
});

/// Handler

const onCreateLobby = (socket, uuid, name) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
        id: roomId,
        users: [],
        round: 0,
        isGameRunning: false
    };

    users[uuid] = {
        name: name,
        state: {
            roomId: roomId,
            isHost: true
        }
    };

    rooms[roomId].users.push(users[uuid]);

    socket.join(roomId);

    socket.emit('lobbyCreated', rooms[roomId]);
};

// TODO: remove logic from client to remove this function
const onCheckRoom = (socket, roomId) => {
    if (rooms[roomId]) {
        socket.emit('roomExists', true);
    }

    socket.emit('roomExists', false);
};

const onJoinLobby = (socket, roomId, name, userId) => {
    // 1. Check if room exists
    if (!rooms[roomId]) {
        socket.emit('error', 'Room does not exist');
        return;
    }

    // 2. Check if a user is host
    const isHost = rooms[roomId].users.find(user => user.host);

    // 3. Store the user
    const user = users[userId];
    user.name = name;
    user.state = {
        roomId: roomId,
        isHost: !isHost
    };

    // 4. Add user to room
    rooms[roomId].users.push(user);
    socket.join(roomId);

    console.log('user', user);

    // 5. Send user info to client
    socket.emit('playerInfo', user);

    // TODO: send whole room to client
    // 6. Send updated lobby to all clients
    io.to(roomId).emit('updateLobby', rooms[roomId].users);
};

const onRefreshLobby = (socket, roomId) => {
    io.to(roomId).emit('updateLobby', rooms[roomId].users);
};

// TODO: add game running check
const onLeaveLobby = (socket, roomId, userId) => {
    console.log(`User ${users[userId].name} left room ${roomId}`);

    const room = rooms[roomId];
    if (!room) return;

    const user = users[userId];
    if (!user) return;

    const newUserList = room.users.filter(() => {
        users[userId].name !== user.name;
    });

    room.users = newUserList;
    rooms[roomId] = room;

    socket.leave(roomId);

    io.to(roomId).emit('updateLobby', rooms[roomId]);
};

io.on('connection', socket => {
    // Generate a new User ID
    const userId = uuidv4();

    // Store the new connection
    connections[userId] = socket;

    // Store User
    users[userId] = {
        name: undefined,
        state: {
            roomId: undefined,
            isHost: false,
            isImposter: false,
            hasChosen: false,
            hasBlamed: false,
            choice: undefined,
            blame: undefined
        }
    };

    console.log('New client connected', userId);

    socket.on('createLobby', name => onCreateLobby(socket, userId, name));

    socket.on('checkRoom', roomId => onCheckRoom(socket, roomId));

    socket.on('joinLobby', ({ roomId, name }) =>
        onJoinLobby(socket, roomId, name, userId)
    );

    socket.on('refreshLobby', ({ roomId }) => onRefreshLobby(socket, roomId));

    socket.on('leaveLobby', roomId => onLeaveLobby(socket, roomId, userId));

    socket.on('startGame', async ({ roomId, options }) => {
        makeUserImposter(roomId);

        const room = getRoom(roomId);

        io.to(roomId).emit('gameStarted', options);
        io.to(roomId).emit('updateLobby', room.users);

        const questions = sendQuestions(roomId);

        if (questions.error) {
            socket.emit('error', questions.error);
            return;
        }

        await io.to(roomId).emit('questions', questions);
    });

    socket.on('choosePlayer', ({ playerId }) => {
        const updatedChoice = updatePlayerChoice(socket.id, playerId);

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
        const choice = updatedPlayerBlame(socket.id, playerId);

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
        io.to(room.id).emit('choiceOfAllPlayers', getPlayerChoices(room.id));
    });

    socket.on('startBlamePhase', () => {
        const room = getRoomFromUser(socket.id);

        if (!room) return;

        io.to(room.id).emit('blamePhaseStarted');
    });

    socket.on('startRevealPhase', () => {
        const room = getRoomFromUser(socket.id);

        if (!room) return;

        const result = revealMismatch(room.id);

        io.to(room.id).emit('revealPhaseStarted');
        io.to(room.id).emit('revealResult', result);
    });

    socket.on('startNextRound', () => {
        const room = getRoomFromUser(socket.id);

        if (!room) return;

        clearForNewGame(room.id);

        io.to(room.id).emit('nextRoundStarted');
    });

    socket.on('disconnect', () => {
        removeUserFromRoom(socket.id);

        // TODO: remove room if no users

        console.log('Client disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log('server running on port', PORT);
});
