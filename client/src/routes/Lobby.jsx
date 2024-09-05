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
import { useToast } from '../hooks/useToast';
import { gameOptionsAtom, whoWonAtom } from '../store/game';
import { playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';
import { roomAtom } from '../store/room';

const Lobby = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [room, setRoom] = useAtom(roomAtom);

    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [gameOptions, setGameOptions] = useAtom(gameOptionsAtom);
    const [questions, setQuestions] = useAtom(questionsAtom);
    const [whoWon, setWhoWon] = useAtom(whoWonAtom);

    const [gameStarted, setGameStarted] = useState(false);

    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const [showOptions, setShowOptions] = useState(false);

    const [parent] = useAutoAnimate();

    const copyIdToClipboard = () => {
        clipboardCopy(room.id);
        showToastWithMessage('Copied ID to Clipboard');
    };

    const players = room.users.filter(user => user.id !== ownPlayer.id);
    const roomId = room.id;

    useEffect(() => {
        if (room.isGameRunning && questions) {
            setGameStarted(true);
            setWhoWon(undefined);
        }
    }, [room, questions]);

    useEffect(() => {
        if (gameStarted && !whoWon) {
            navigate('/game');
        }
    }, [gameStarted]);

    useEffect(() => {
        if (socket) {
            socket.on('error', error => {
                console.log(error);
            });

            socket.on('updateLobby', room => {
                if (!gameStarted) {
                    setRoom(room);

                    const user = room.users.find(
                        user => user.id === ownPlayer.id
                    );

                    setOwnPlayer(user);
                }
            });

            socket.on('gameStarted', ({ options, questions }) => {
                setGameOptions(options);
                setQuestions(questions);
            });

            return () => {
                socket.off('error');
                socket.off('updateLobby');
                socket.off('gameStarted');
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

    const startGame = e => {
        e.preventDefault();

        if (players.length < 2) {
            showToastWithMessage('You need at least 3 Players', 'error');
            return;
        }

        socket.emit('startGame', {
            roomId: roomId,
            options: gameOptions
        });
    };

    return (
        <>
            <div className='flex flex-col justify-between gap-4 h-full w-full items-center'>
                <div className='flex flex-col gap-8 w-full'>
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

                    <div class='w-full flex flex-col gap-1'>
                        <h2 className='text-xl text-teal-700'>Players</h2>
                        <ul
                            className='flex flex-col gap-2 items-center overflow-y-auto'
                            ref={parent}
                        >
                            <PlayerCard
                                name={ownPlayer.name}
                                host={ownPlayer.state.isHost}
                                backgroundColor='rgb(52 211 153)'
                            />
                            {players.map(player => (
                                <PlayerCard
                                    key={player.id}
                                    name={player.name}
                                    host={player.state.isHost}
                                    backgroundColor={
                                        player.state.isHost
                                            ? 'rgb(103 232 249)'
                                            : 'rgb(254 240 138)'
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-full'>
                    {ownPlayer.state.isHost && (
                        <Button handler={e => startGame(e)}>Start Game</Button>
                    )}

                    <button
                        onClick={e => onLeaveLobby(e)}
                        className='text-2xl font-bold text-neutral-600 bg-white/80 border-2 rounded-md border-neutral-400 p-2'
                    >
                        Leave
                    </button>
                </div>
            </div>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={hideToast}
            />
        </>
    );
};

export default Lobby;
