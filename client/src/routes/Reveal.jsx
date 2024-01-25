import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlamedPlayerDisplay from '../components/BlamedPlayerDisplay';
import Button from '../components/Button';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';

import { whoWonAtom } from '../store/game';
import { playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';
import { roomAtom } from '../store/room';

const Reveal = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [questions] = useAtom(questionsAtom);
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);

    const [whoWon, setWhoWon] = useAtom(whoWonAtom);

    const [counter, setCounter] = useState(5);

    let youWon;

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        socket.on('nextRoundStarted', room => {
            if (room.id !== ownPlayer.state.roomId) return;

            const user = room.users.find(user => user.id === ownPlayer.id);
            setOwnPlayer(user);

            setRoom(room);
            setWhoWon(undefined);
        });

        return () => {
            socket.off('nextRoundStarted');
        };
    }, [socket]);

    useEffect(() => {
        if (room.isGameRunning) return;
        navigate(`/lobby/${room.id}`);
    }, [room.isGameRunning]);

    if (whoWon === 'defaultsWon') {
        youWon = !ownPlayer.state.isImposter;
    } else {
        youWon = ownPlayer.state.isImposter;
    }

    const revealCountdown = counter > 0;
    const revealText = youWon ? 'You won!' : 'You lost!';
    const revealColor = youWon ? 'text-green-400' : 'text-red-400';
    const blamedPlayer = room.users.find(
        player => player.id === ownPlayer.state.blame
    );
    const imposter = room.users.find(player => player.state.isImposter);

    const nextGameButton = ownPlayer.state.isHost && (
        <Button
            handler={() => {
                socket.emit('startNextRound', room.id);
            }}
            color='#FF9B71'
            className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
        >
            Next Game
        </Button>
    );

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Reveal Phase</h1>
            {revealCountdown ? (
                <h2 className='text-4xl'>Reveal in {counter}</h2>
            ) : (
                <>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        The Mismatch is:{' '}
                        <span className={`${revealColor} text-8xl`}>
                            {imposter?.name}
                        </span>
                    </h2>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        {revealText}
                    </h2>
                    <div>
                        <h2 className='text-2xl mb-4'>Imposter Question:</h2>
                        <QuestionCard
                            size={'small'}
                            question={questions.imposterQuestion}
                        />
                    </div>
                    <BlamedPlayerDisplay
                        blamedPlayerName={blamedPlayer?.name}
                    />
                    {nextGameButton}
                </>
            )}
        </div>
    );
};

export default Reveal;
