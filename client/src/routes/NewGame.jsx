import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clipboard from '../assets/clipboard.png';
import Button from '../components/Button';
import PlayerCard from '../components/PlayerCard';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { gameIdAtom, isGameRunningAtom } from '../store/game';
import { nameAtom } from '../store/name';
import { allPlayersAtom, playerAtom } from '../store/players';
import clipboardCopy from 'clipboard-copy'; 

const NewGame = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [name] = useAtom(nameAtom);
    const [gameId, setGameId] = useAtom(gameIdAtom);
    const [players, setPlayers] = useAtom(allPlayersAtom);
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [showToast, setShowToast] = useState(false);
    const [showIDCopiedToast, setShowCopyToast] = useState(false);
    const [isGameRunning] = useAtom(isGameRunningAtom);

    const [parent] = useAutoAnimate();

    const copyIdToClipboard = () => {
        clipboardCopy(gameId);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    useEffect(() => {
        if (gameId && socket) {
            !isGameRunning
                ? socket.emit('joinLobby', { roomId: gameId, name: name })
                : socket.emit('refreshLobby', { roomId: gameId });

            socket.on('error', error => {
                console.log(error);
            });

            socket.on('updateLobby', players => {
                setOwnPlayer(players.find(player => player.id === socket.id));
                setPlayers(players.filter(player => player.id !== socket.id));
            });

            socket.on('playerInfo', player => {
                setOwnPlayer(player);
            });

            socket.on('gameStarted', () => {
                navigate(`/game/`);
            });

            socket.on('disconnect', () => {
                socket.on('updateLobby', players => {
                    setPlayers(players);
                });
            });

            return () => {
                socket.off('updateLobby');
                socket.off('playerInfo');
                socket.off('gameStarted');
                socket.off('disconnect');
            };
        }
    }, [
        gameId,
        isGameRunning,
        name,
        navigate,
        ownPlayer,
        setOwnPlayer,
        setPlayers,
        socket
    ]);

    const leaveLobby = () => {
        socket && socket.emit('leaveLobby', { roomId: gameId });

        setGameId('');
        navigate('/');
    };

    const startGame = () => {
        if (players.length < 2) {
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
                <div className='border border-black opacity-50 p-2 rounded-lg shadow-md hover:cursor-pointer'
                    onClick={copyIdToClipboard}
                >
                    <img
                        src={clipboard}
                        alt='copy link'
                        className='h-6 opacity-80'
                    />
                </div>
            </div>
            <div className='border rounded-lg'>
                <h2 className='text-2xl p-4'>Players:</h2>
                <ul
                    className='flex flex-col gap-2 w-64 h-32  items-center m-2 overflow-y-scroll'
                    ref={parent}
                >
                    <PlayerCard
                        name={ownPlayer.name}
                        host={ownPlayer.host}
                        backgroundColor='#FFFD82'
                    />
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
                {ownPlayer.host && (
                    <Button
                        handler={startGame}
                        color='#1B998B'
                        className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                    >
                        Start Game
                    </Button>
                )}

                <Button color='#E84855' handler={leaveLobby}>
                    Leave
                </Button>
            </div>
            <Toast
                message={'You need at least 3 Players'}
                type={'error'} 
                show={showToast}
                onClose={() => setShowToast(false)}
            />
            <Toast
                message={'Game ID copied'}
                type={'none'} 
                show={showIDCopiedToast}
                onClose={() => setShowCopyToast(false)}
            />
        </div>
    );
};

export default NewGame;
