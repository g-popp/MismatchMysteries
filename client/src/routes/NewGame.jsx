import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clipboard from '../assets/clipboard.png';
import Button from '../components/Button';
import PlayerCard from '../components/PlayerCard';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { gameIdAtom } from '../store/game';
import { nameAtom } from '../store/name';

const NewGame = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [name] = useAtom(nameAtom);
    const [gameId, setGameId] = useAtom(gameIdAtom);
    const [players, setPlayers] = useState([]);
    const [playerObject, setPlayerObject] = useState({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (gameId && socket) {
            socket.emit('joinLobby', { roomId: gameId, name: name });

            socket.on('error', error => {
                console.log(error);
            });

            socket.on('updateLobby', players => {
                setPlayers(players);
            });

            socket.on('playerInfo', player => {
                setPlayerObject(player);
            });

            socket.on('gameStarted', () => {
                navigate(`/game/`);
            });

            socket.on('disconnect', () => {
                socket.on('updateLobby', players => {
                    setPlayers(players);
                });
            });
        }
    }, [gameId, name, navigate, socket]);

    const leaveLobby = () => {
        socket && socket.emit('leaveLobby', { roomId: gameId });

        setGameId('');
        navigate('/');
    };

    const startGame = () => {
        if (players.length < 3) {
            setShowToast(true);
            return;
        }

        socket && socket.emit('startGame', { roomId: gameId });
    };

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game Lobby</h1>
            <div className='flex flex-row gap-6 items-center'>
                <h2 className='text-4xl'>ID: {gameId}</h2>
                <div className='border border-black opacity-50 p-2 rounded-lg shadow-md hover:cursor-pointer'>
                    <img
                        src={clipboard}
                        alt='copy link'
                        className='h-6 opacity-80'
                    />
                </div>
            </div>
            <div className='border rounded-lg'>
                <h2 className='text-2xl p-4'>Players:</h2>
                <ul className='flex flex-col gap-2 w-64 h-32  items-center m-2 overflow-y-scroll'>
                    {players.map(player => (
                        <PlayerCard
                            key={player.id}
                            name={player.name}
                            host={player.host}
                            backgroundColor='#FF9B71'
                        />
                    ))}
                </ul>
            </div>
            <div className='flex flex-col gap-6'>
                {playerObject.host && (
                    <Button
                        handler={startGame}
                        color='bg-[#1B998B]'
                        className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                    >
                        Start Game
                    </Button>
                )}

                <Button color='bg-[#E84855]' handler={leaveLobby}>
                    Leave
                </Button>
            </div>
            <Toast
                message={'You need at least 3 Players'}
                type={'error'}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default NewGame;
