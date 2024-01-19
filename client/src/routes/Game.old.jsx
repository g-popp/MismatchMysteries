import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import ChoosePlayer from '../components/ChoosePlayer';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';
import { gameRoundAtom } from '../store/game';
import { allPlayersAtom, playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const GameOld = () => {
    const socket = useContext(SocketContext);
    const [questions, setQuestions] = useAtom(questionsAtom);
    const [players, setPlayers] = useAtom(allPlayersAtom);
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [gameRound, setGameRound] = useAtom(gameRoundAtom);

    const [counter, setCounter] = useState(5);

    useEffect(() => {
        setGameRound(prev => prev + 1);
    }, []);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        if (socket) {
            const handleUpdateLobby = players => {
                setOwnPlayer(players.find(player => player.id === socket.id));
                setPlayers(players.filter(player => player.id !== socket.id));
            };

            const handleQuestions = questions => {
                setQuestions(questions);
            };

            socket.on('updateLobby', handleUpdateLobby);
            socket.on('questions', handleQuestions);

            return () => {
                socket.off('updateLobby', handleUpdateLobby);
                socket.off('questions', handleQuestions);
            };
        }
    }, []);

    const gameReady = ownPlayer && players && questions && socket;
    const gameCountdown = counter > 0;
    const question = ownPlayer?.imposter
        ? questions?.imposterQuestion
        : questions?.normalQuestion;

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game - Number {gameRound}</h1>
            {gameCountdown ? (
                <div className='flex flex-col justify-center gap-10 mt-6 text-center'>
                    <h2 className='text-4xl'>Game starts in {counter}</h2>
                    <h3 className='text-2xl max-w-md text-gray-400 opacity-80'>
                        Please don't speak in this Phase or let someone see your{' '}
                        <span className='text-teal-600'>Screen!</span>
                    </h3>
                </div>
            ) : gameReady ? (
                <>
                    <QuestionCard question={question} />
                    <ChoosePlayer players={players} socket={socket} />
                </>
            ) : (
                <h1 className='text-3xl underline'>Loading...</h1>
            )}
        </div>
    );
};

export default GameOld;
