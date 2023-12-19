import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import Layout from './Layout.jsx';

import { SocketProvider } from './context/socket.jsx';
import ErrorPage from './error-page.jsx';
import './index.css';
import Game from './routes/Game.jsx';
import Join from './routes/Join.jsx';
import NewGame from './routes/NewGame.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />
    },
    {
        element: <Layout />,
        children: [
            // {
            //     path: '/newGame',
            //     element: <NewGame />
            // },
            {
                path: '/newGame/:id',
                element: <NewGame />
            },
            {
                path: '/join',
                element: <Join />
            },
            {
                path: '/game',
                element: <Game />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SocketProvider>
            <RouterProvider router={router} />
        </SocketProvider>
    </React.StrictMode>
);
