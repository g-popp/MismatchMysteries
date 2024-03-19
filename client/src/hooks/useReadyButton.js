import { useState } from 'react';

const useReadyButton = (socket, roomId, user) => {
    const [isReady, setIsReady] = useState(user.state.isReady);

    const toggleReady = () => {
        socket.emit('playerReady', { roomId: roomId, userId: user.id });
        setIsReady(true);
    };

    return [isReady, toggleReady];
};

export default useReadyButton;
