import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { playerAtom } from '../store/players';
import { roomAtom } from '../store/room';

import Logo from '../assets/logo.svg';

const Home = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);

    const [showToast, toastType, toastMessage, hideToast] = useToast();

    const [playerSet, setPlayerSet] = useState(false);

    const handleNewGame = e => {
        e.preventDefault();

        socket.emit('createLobby', ownPlayer.name);
    };

    useEffect(() => {
        if (socket) {
            socket.on('lobbyCreated', room => {
                setRoom(room);

                socket.on('playerInfo', player => {
                    setOwnPlayer(player);
                    setPlayerSet(true);
                });
            });

            socket.on('error', message => {
                console.error(message);
            });

            return () => {
                socket.off('lobbyCreated');
                socket.off('playerInfo');
                socket.off('error');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (playerSet && room.id) {
            navigate(`/join`);
        }
    }, [playerSet, room]);

    return (
        <div className='flex flex-col p-8 items-center gap-40'>
            <h1 className='text-6xl text-black underline text-center'>
                Friends Don&apos;t Lie
            </h1>
            <img src={Logo} className=' w-10/12' />
            <Button color='#1B998B' handler={e => handleNewGame(e)}>
                Play Now
            </Button>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={hideToast}
            />
        </div>
    );
};

export default Home;
