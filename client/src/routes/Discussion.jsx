import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import SelectedPlayerDisplay from '../components/SelectedPlayerDisplay';
import VotingTable from '../components/VotingTable';
import ReadyButton from '../components/ui/ReadyButton';
import ReadyText from '../components/ui/ReadyText';
import { SocketContext } from '../context/socket';
import useReadyButton from '../hooks/useReadyButton';
import { gameOptionsAtom } from '../store/game';
import { playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';
import { roomAtom } from '../store/room';

const Discussion = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();

    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);
    const [gameOptions] = useAtom(gameOptionsAtom);
    const [questions] = useAtom(questionsAtom);

    const [counter, setCounter] = useState(5);

    const [isReady, toggleReady] = useReadyButton(socket, room.id, ownPlayer);

    const choosenPlayer = room.users.find(
        user => user.id === ownPlayer?.state?.choice
    );

    const playerChoices = room.users.map(user => {
        return {
            chooser: user,
            choice: room.users.find(player => player.id === user.state.choice)
        };
    });

    useEffect(() => {
        socket.on('updateLobby', room => {
            if (room.id !== ownPlayer.state.roomId) return;

            const user = room.users.find(user => user.id === ownPlayer.id);
            setOwnPlayer(user);

            setRoom(room);
        });

        socket.on('blamePhaseStarted', () => {
            navigate('/blame');
        });

        return () => {
            socket.off('updateLobby');
            socket.off('blamePhaseStarted');
        };
    }, [socket]);

    useEffect(() => {
        if (!room.isGameRunning) {
            navigate(`/lobby/${ownPlayer.state.roomId}`);
        }
    }, [room.isGameRunning]);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    const startBlamePhase = e => {
        e.preventDefault();
        socket.emit('startBlamePhase', room.id);
    };

    return (
        <>
            <div className='flex flex-col items-center gap-8'>
                <h1 className='text-xl underline'>Discussion Phase</h1>

                {counter > 0 ? (
                    <div className='flex flex-col justify-center gap-10 mt-6 text-center'>
                        <h2 className='text-4xl'>
                            Discussion starts in {counter}
                        </h2>
                        <h3 className='text-2xl max-w-md text-gray-400 opacity-80'>
                            Now you can{' '}
                            <span className='text-teal-600'>talk</span> again!
                        </h3>
                    </div>
                ) : (
                    <>
                        {gameOptions.couchMode ? (
                            <SelectedPlayerDisplay
                                selectedPlayerName={choosenPlayer?.name}
                            />
                        ) : (
                            <div>
                                <VotingTable playerChoices={playerChoices} />
                            </div>
                        )}

                        <div>
                            <h2 className='text-xl mb-2'>Real Question:</h2>
                            <QuestionCard
                                size={'small'}
                                question={questions.normalQuestion}
                            />
                        </div>
                        <ReadyText users={room.users} />
                        <div className='flex justify-between gap-8'>
                            <ReadyButton
                                isReady={isReady}
                                toggleReady={toggleReady}
                            />
                            {!counter > 0 && ownPlayer.state.isHost && (
                                <button
                                    className={`${
                                        isReady ? 'bg-teal-600' : 'bg-zinc-500'
                                    } text-black text-center text-lg py-2 px-6 border border-black rounded shadow-sm shadow-black`}
                                    onClick={e => startBlamePhase(e)}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Discussion;
