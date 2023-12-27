import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const URL = 'https://mismatchmysteries-production.up.railway.app/';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();

    useEffect(() => {
        const newSocket = io(URL);

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
