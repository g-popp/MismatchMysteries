import { useAutoAnimate } from '@formkit/auto-animate/react';
import clipboardCopy from 'clipboard-copy';
import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import IdCard from '../components/IdCard';
import PlayerCard from '../components/PlayerCard';
import SettingsModal from '../components/SettingsModal';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { gameOptionsAtom } from '../store/game.old';
import { playerAtom } from '../store/players';
import { roomAtom } from '../store/room';

const Lobby = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [room, setRoom] = useAtom(roomAtom);

    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [gameOptions] = useAtom(gameOptionsAtom);

    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const [showOptions, setShowOptions] = useState(false);

    const [parent] = useAutoAnimate();

    const copyIdToClipboard = () => {
        clipboardCopy(room.id);
        setToastMessage('Game ID copied');
        setToastType('default');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const players = room.users.filter(user => user.id !== ownPlayer.id);
    const roomId = room.id;

    useEffect(() => {
        if (socket) {
            // socket.emit('joinLobby', { roomId: gameId, name: name })
            // socket.emit('refreshLobby', { roomId: gameId });

            socket.on('error', error => {
                console.log(error);
            });

            socket.on('updateLobby', room => {
                console.log(room);
            });

            // socket.on('updateLobby', players => {
            //     setOwnPlayer(players.find(player => player.id === socket.id));
            //     setPlayers(players.filter(player => player.id !== socket.id));
            // });

            // socket.on('playerInfo', player => {
            //     setOwnPlayer(player);
            // });

            // socket.on('gameStarted', options => {
            //     setGameOptions(options);
            //     navigate(`/game/`);
            // });

            // socket.on('disconnect', () => {
            //     socket.on('updateLobby', players => {
            //         setPlayers(players);
            //     });
            // });

            return () => {
                socket.off('error');
            };
        }
    }, [socket]);

    const onLeaveLobby = e => {
        e.preventDefault();

        socket.emit('leaveLobby', ownPlayer.id);

        setOwnPlayer({ ...ownPlayer, state: { roomId: undefined } });

        setRoom({ id: undefined, users: [] });

        navigate('/');
    };

    const startGame = () => {
        if (players.length < 2) {
            setToastMessage('You need at least 3 Players');
            setToastType('error');
            setShowToast(true);
            return;
        }

        socket &&
            socket.emit('startGame', {
                roomId: roomId,
                options: gameOptions
            });
    };

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game Lobby</h1>

            <IdCard
                gameId={room.id}
                host={ownPlayer.state.isHost}
                copyIdToClipboard={copyIdToClipboard}
                openOptions={() => setShowOptions(true)}
            />

            <SettingsModal
                isOpen={showOptions}
                close={() => setShowOptions(false)}
            />

            <div className='border rounded-lg'>
                <h2 className='text-2xl p-4'>Players:</h2>
                <ul
                    className='flex flex-col gap-2 w-64 h-32  items-center m-2 overflow-y-scroll'
                    ref={parent}
                >
                    <PlayerCard
                        name={ownPlayer.name}
                        host={ownPlayer.state.isHost}
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
                {ownPlayer.state.isHost && (
                    <Button
                        handler={startGame}
                        color='#1B998B'
                        className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                    >
                        Start Game
                    </Button>
                )}

                <Button color='#E84855' handler={e => onLeaveLobby(e)}>
                    Leave
                </Button>
            </div>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Lobby;
