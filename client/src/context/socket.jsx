import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:4000/'
        : 'https://mismatchmysteries-production.up.railway.app/';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();

    console.log(import.meta.env.MODE);

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
