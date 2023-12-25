import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import ChoosePlayer from '../components/ChoosePlayer';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';
import { playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const Game = () => {
    const socket = useContext(SocketContext);
    const [questions, setQuestions] = useAtom(questionsAtom);
    const [players, setPlayers] = useState([]);
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);

    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        if (socket) {
            socket.on('updateLobby', players => {
                players = players.filter(player => player.id !== socket.id);
                setPlayers(players);
            });

            socket.on('playerInfo', player => {
                setOwnPlayer(player);
                console.log(player);
            });

            socket.on('questions', questions => {
                setQuestions(questions);
            });
        }
    }, [setPlayers, socket, setOwnPlayer, ownPlayer, setQuestions]);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game</h1>
            {counter > 0 ? (
                <h2 className='text-4xl'>Game starts in {counter}</h2>
            ) : (
                <>
                    <QuestionCard
                        question={
                            ownPlayer?.imposter
                                ? questions.imposterQuestion
                                : questions.normalQuestion
                        }
                    />
                    <ChoosePlayer players={players} />
                </>
            )}
        </div>
    );
};

export default Game;
