export const leaveLobby = (socket, userId, setOwnPlayer, setRoom) => {
    socket.emit('leaveLobby', userId);

    setOwnPlayer(prev => ({
        ...prev,
        state: {
            ...prev.state,
            roomId: undefined,
            isHost: false
        }
    }));

    setRoom({
        id: undefined,
        users: [],
        isGameRunning: false,
        round: 0
    });
};
