import { useState } from 'react';

const useReadyButton = (socket, roomId) => {
    const [isReady, setIsReady] = useState(false);

    const toggleReady = () => {
        socket.emit('toggleReady', roomId);
        setIsReady(true);
    };

    return [isReady, toggleReady];
};

export default useReadyButton;
