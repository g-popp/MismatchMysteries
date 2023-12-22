import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? undefined
        : 'localhost:4000';

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
