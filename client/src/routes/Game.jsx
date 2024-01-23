import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import QuestionCard from '../components/QuestionCard';
import SelectPlayer from '../components/SelectPlayer';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';
import { roomAtom } from '../store/room';

const Game = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);
    const [questions] = useAtom(questionsAtom);

    const [allPlayersChosen, setAllPlayersChosen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [counter, setCounter] = useState(5);

    const startRevealPhase = e => {
        e.preventDefault();

        socket.emit('startDiscussionPhase', room.id);
    };

    const setPlayerChoice = playerId => {
        setOwnPlayer(prev => ({
            ...prev,
            state: {
                ...prev.state,
                hasChosen: true,
                choice: playerId
            }
        }));
    };

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => {
            clearInterval(timer);
        };
    }, [counter]);

    useEffect(() => {
        if (!room.isGameRunning) {
            navigate(`/lobby/${ownPlayer.state.roomId}`);
        }
    }, [room]);

    useEffect(() => {
        if (socket) {
            socket.on('updateLobby', room => {
                if (room.id !== ownPlayer.state.roomId) return;

                const user = room.users.find(user => user.id === ownPlayer.id);
                setOwnPlayer(user);

                setRoom(room);
            });

            socket.on('allPlayersChosen', () => {
                setShowToast(true);
                setAllPlayersChosen(true);
            });

            socket.on('discussionPhaseStarted', () => {
                navigate('/discussion');
            });

            return () => {
                socket.off('updateLobby');
                socket.off('allPlayersChosen');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (ownPlayer.state.hasChosen) {
            socket.emit('choosePlayer', ownPlayer);
        }
    }, [ownPlayer.state.choice]);

    const gameCountdown = counter > 0;
    const question = ownPlayer.state.isImposter
        ? questions.imposterQuestion
        : questions.normalQuestion;
    const players = room.users.filter(user => user.id !== ownPlayer.id);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game - Number {room.round}</h1>
            {gameCountdown ? (
                <div className='flex flex-col justify-center gap-10 mt-6 text-center'>
                    <h2 className='text-4xl'>Game starts in {counter}</h2>
                    <h3 className='text-2xl max-w-md text-gray-400 opacity-80'>
                        Please don't speak in this Phase or let someone see your{' '}
                        <span className='text-teal-600'>Screen!</span>
                    </h3>
                </div>
            ) : (
                <>
                    <QuestionCard question={question} />
                    <SelectPlayer
                        players={players}
                        setPlayer={setPlayerChoice}
                    />
                </>
            )}
            {allPlayersChosen && ownPlayer.state.isHost && (
                <Button color='#10b981' handler={e => startRevealPhase(e)}>
                    Next
                </Button>
            )}
            <Toast
                message={'All Player selected someone'}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Game;
