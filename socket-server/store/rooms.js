let rooms = [];

const addRoom = ({ id }) => {
    if (!id) return { error: 'Valid Game Lobby required' };

    const existingRoom = rooms.find(room => room.id === id);

    if (existingRoom)
        return {
            error: 'Room is in use'
        };

    // Store the room
    const room = { id };
    rooms.push(room);

    return room;
};

const getRoom = id => rooms.find(room => room.id === id);

const getRoomFromUser = id => {
    const room = rooms.find(room => room.users.find(user => user.id === id));

    return room;
};

const removeRoom = id => {
    const room = rooms.find(room => room.id === id);

    if (room) {
        rooms = rooms.filter(room => room.id !== id);
    }
};

const addUserToRoom = ({ roomId, name, id }) => {
    const room = getRoom(roomId);

    if (!room) return { error: 'Valid Game Lobby required' };

    const existingUser = room.users?.find(user => user.id === id);

    if (existingUser)
        return {
            error: 'Username is in use'
        };

    // is User Host?
    const isHost = room.users?.find(user => user.host);

    // Store the user
    const user = { id, name, host: !isHost, imposter: false };

    if (!room.users) {
        room.users = [];
    }

    room.users.push(user);

    return { user };
};

const makeUserImposter = id => {
    const room = rooms.find(room => room.users.find(user => user.id === id));

    if (room) {
        const user = room.users.find(user => user.id === id);

        if (user) {
            user.imposter = true;
        }
    }
};

const removeUserFromRoom = id => {
    const room = rooms.find(room => room.users.find(user => user.id === id));

    if (room) {
        const user = room.users.find(user => user.id === id);

        // make other user host
        if (user && user.host) {
            const otherUser = room.users.find(user => user.id !== id);

            if (!otherUser) return removeRoom(room.id);
            otherUser.host = true;
        }

        room.users = room.users.filter(user => user.id !== id);

        if (room.users.length === 0) {
            rooms = rooms.filter(room => room.id !== room.id);
        }

        return room.users;
    }
};

const getUser = id => {
    const room = rooms.find(room => room.users.find(user => user.id === id));

    if (room) {
        return room.users.find(user => user.id === id);
    }
};

export {
    addRoom,
    addUserToRoom,
    getRoom,
    getRoomFromUser,
    getUser,
    makeUserImposter,
    removeUserFromRoom
};
