const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim();
    room = room.trim();
    let host = false;

    if (!username) return { error: 'Username required' };
    if (!room) return { error: 'Valid Game Lobby required' };

    const existingUser = users.find(
        user => user.room === room && user.username === username
    );

    if (existingUser)
        return {
            error: 'Username is in use'
        };

    const isHost = users.find(user => user.room === room && user.host);

    if (!isHost) {
        host = true;
    }

    // Store the user
    const user = { id, username, host, room };
    users.push(user);
    return { user };
};

const removeUser = id => {
    const user = users.find(user => user.id === id);

    // make other user host
    if (user && user.host) {
        const otherUser = users.find(
            user => user.room === user.room && user.id !== id
        );
        if (otherUser) otherUser.host = true;

        return users.splice(users.indexOf(user), 1)[0];
    }

    if (user) return users.splice(users.indexOf(user), 1)[0];

    return { error: 'User not found' };
};

export { addUser, removeUser };
