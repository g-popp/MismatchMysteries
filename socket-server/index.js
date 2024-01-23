import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
    clearForNewGame,
    haveAllPlayersBlamed,
    revealMismatch,
    updatedPlayerBlame
} from './store/game.js';
import { getRoomFromUser } from './store/rooms.js';
import getQuestions from './utils/getQuestions.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*'
    },
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

/// --- HELPERS --- ///
const isUserInRoom = (userId, roomId) => {
    const room = rooms[roomId];
    if (!room) return false;

    return room.users.find(user => user.id === userId);
};

const updatePlayer = player => {
    const room = rooms[player.state.roomId];
    if (!room) return { error: 'Room does not exist' };

    const user = room.users.find(user => user.id === player.id);
    if (!user) return { error: 'User does not exist' };

    room.users.map(user => {
        if (user.id === player.id) {
            user.state = player.state;
        }
    });
};

const defaultPlayersState = roomId => {
    const room = rooms[roomId];
    if (!room) return;

    room.users.map(user => {
        user.state.hasChosen = false;
        user.state.hasBlamed = false;
        user.state.choice = undefined;
        user.state.blame = undefined;
    });
};

/// --- HANDLER --- ///
const onCreateLobby = (socket, userId, name) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
        id: roomId,
        users: [],
        round: 0,
        isGameRunning: false
    };

    users[userId] = {
        name: name,
        id: userId,
        state: {
            roomId: roomId,
            isHost: true
        }
    };

    rooms[roomId].users.push(users[userId]);

    socket.join(roomId);

    socket.emit('lobbyCreated', rooms[roomId]);
    socket.emit('playerInfo', users[userId]);
};

const onJoinLobby = (socket, roomId, name, userId) => {
    // 1. Check if room exists
    if (!rooms[roomId]) {
        socket.emit('error', 'Room does not exist');
        return;
    }

    if (isUserInRoom(userId, roomId)) {
        socket.emit('error', 'You are already in this room');
        return;
    }

    // 2. Check if a user is host
    const isHost = rooms[roomId].users.find(user => user.state.isHost);

    // if user is in room
    rooms[roomId].users.find(user => user.id === userId);

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

    // 5. Send user info to client
    socket.emit('playerInfo', user);
    // 6. Send updated lobby to all clients
    io.to(roomId).emit('updateLobby', rooms[roomId]);
};

const onRefreshLobby = (socket, roomId) => {
    io.to(roomId).emit('updateLobby', rooms[roomId].users);
};

const onLeaveLobby = (socket, userId) => {
    const user = users[userId];
    if (!user) return;

    const room = rooms[user.state.roomId];
    if (!room) return;

    const newUserList = room.users.filter(user => {
        return user.id !== userId;
    });

    if (user.state.isHost && newUserList.length > 0) {
        const newHost = newUserList[0];
        newHost.state.isHost = true;
    }

    if (room.isGameRunning) {
        rooms[room.id].isGameRunning = false;
    }

    rooms[room.id].users = newUserList;

    io.to(room.id).emit('updateLobby', rooms[room.id]);

    socket.leave(room.id);
};

const onStartGame = (roomId, options) => {
    const room = rooms[roomId];
    if (!room) return;

    defaultPlayersState(roomId);

    const imposter = room.users[Math.floor(Math.random() * room.users.length)];
    rooms[roomId].users.map(user =>
        user.id === imposter.id
            ? (user.state.isImposter = true)
            : (user.state.isImposter = false)
    );
    rooms[roomId].isGameRunning = true;
    rooms[roomId].round = room.round + 1;

    const questions = getQuestions(roomId);

    io.to(roomId).emit('gameStarted', { options, questions });
    io.to(roomId).emit('updateLobby', rooms[roomId]);
};

const onChoosePlayer = (socket, user) => {
    const roomId = user.state.roomId;
    const updatedChoice = updatePlayer(user);

    if (updatedChoice?.error) {
        socket.emit('error', updatedChoice.error);
        return;
    }

    io.to(roomId).emit('updateLobby', rooms[roomId]);

    const allPlayersChosen = rooms[roomId].users.every(
        user => user.state.hasChosen
    );

    if (allPlayersChosen) {
        io.to(roomId).emit('allPlayersChosen');
    }
};

/// --- SOCKET --- ///
io.on('connection', socket => {
    // Generate a new User ID
    const userId = uuidv4();

    // Store the new connection
    connections[userId] = socket;

    // Store User
    users[userId] = {
        name: undefined,
        id: userId,
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

    socket.on('createLobby', name => onCreateLobby(socket, userId, name));

    socket.on('checkRoom', (roomId, callback) => {
        if (rooms[roomId]) {
            callback(null);
            return;
        }

        callback({ error: 'Room does not exist' });
    });

    socket.on('joinLobby', ({ roomId, name }) =>
        onJoinLobby(socket, roomId, name, userId)
    );

    socket.on('refreshLobby', ({ roomId }) => onRefreshLobby(socket, roomId));

    socket.on('leaveLobby', userId => onLeaveLobby(socket, userId));

    socket.on('startGame', ({ roomId, options }) =>
        onStartGame(roomId, options)
    );

    socket.on('choosePlayer', user => onChoosePlayer(socket, user));

    socket.on('startDiscussionPhase', roomId =>
        io.to(roomId).emit('discussionPhaseStarted')
    );

    socket.on('startBlamePhase', roomId =>
        io.to(roomId).emit('blamePhaseStarted')
    );

    /// --- SEPERATOR --- ///

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
        }
    });

    // socket.on('startDiscussionPhase', () => {
    //     const room = getRoomFromUser(socket.id);

    //     if (!room) return;

    //     io.to(room.id).emit('discussionPhaseStarted');
    //     io.to(room.id).emit('choiceOfAllPlayers', getPlayerChoices(room.id));
    // });

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
        const user = users[userId];
        if (!user) return;

        const room = rooms[user.state.roomId];
        if (!room) return;

        const newUserList = room.users.filter(() => {
            return user.id !== userId;
        });

        rooms[room.id].users = newUserList;

        socket.leave(room.id);

        io.to(room.id).emit('updateLobby', rooms[room.id]);

        delete connections[userId];
        delete users[userId];

        console.log('Client disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log('server running on port', PORT);
});
