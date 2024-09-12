import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import Layout from './Layout.jsx';

import { SocketProvider } from './context/socket.jsx';
import ErrorPage from './error-page.jsx';
import './index.css';
import Blame from './routes/Blame.jsx';
import Discussion from './routes/Discussion.jsx';
import Game from './routes/Game.jsx';
import Host from './routes/Host.jsx';
import Join from './routes/Join.jsx';
import Lobby from './routes/Lobby.jsx';
import Reveal from './routes/Reveal.jsx';
import EditQuestions from './routes/EditQuestions.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />
    },
    {
        element: <Layout />,
        children: [
            {
                path: '/lobby/:id',
                element: <Lobby />
            },
            {
                path: '/join',
                element: <Join />
            },
            {
                path: '/host',
                element: <Host />
            },
            {
                path: '/game',
                element: <Game />
            },
            {
                path: '/discussion',
                element: <Discussion />
            },
            {
                path: '/blame',
                element: <Blame />
            },
            {
                path: '/reveal',
                element: <Reveal />
            },
            {
                path: '/edit-questions',
                element: <EditQuestions />
            }
        ]
    }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SocketProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </SocketProvider>
    </React.StrictMode>
);
