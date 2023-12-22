import { useContext, useEffect, useState } from 'react';
import ChoosePlayer from '../components/ChoosePlayer';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';

const Game = () => {
    const socket = useContext(SocketContext);
    const [question, setQuestion] = useState('');
    const [players, setPlayers] = useState([]);

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

            socket.on('question', question => {
                console.log(question);
                setQuestion(question);
            });
        }
    }, [socket]);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game</h1>
            {counter > 0 ? (
                <h2 className='text-4xl'>Game starts in {counter}</h2>
            ) : (
                <>
                    <QuestionCard question={question} />
                    <ChoosePlayer players={players} />
                </>
            )}
        </div>
    );
};

export default Game;
