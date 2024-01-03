import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import SelectedPlayerDisplay from '../components/SelectedPlayerDisplay';
import VotingTable from '../components/VotingTable';
import { SocketContext } from '../context/socket';
import { gameOptionsAtom } from '../store/game';
import { playerAtom, selectedPlayerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const Discussion = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();

    const [ownPlayer] = useAtom(playerAtom);
    const [selectedPlayer] = useAtom(selectedPlayerAtom);
    const [questions] = useAtom(questionsAtom);
    const [playerChoices, setPlayerChoices] = useState([]);

    const [gameOptions] = useAtom(gameOptionsAtom);

    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (socket) {
            socket.on('blamePhaseStarted', () => {
                navigate('/blame');
            });

            socket.on('choiceOfAllPlayers', playerChoices => {
                setPlayerChoices(playerChoices);
            });

            return () => {
                socket.off('blamePhaseStarted');
                socket.off('choiceOfAllPlayers');
            };
        }
    }, [navigate, socket, setPlayerChoices]);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    const startBlamePhase = () => {
        socket.emit('startBlamePhase');
    };

    return (
        <>
            <div className='flex flex-col items-center gap-24'>
                <h1 className='text-2xl underline'>Discussion Phase</h1>

                {counter > 0 ? (
                    <h2 className='text-4xl text-center'>
                        Discussion starts in {counter}
                    </h2>
                ) : (
                    <>
                        {gameOptions.couchMode ? (
                            <SelectedPlayerDisplay
                                selectedPlayerName={selectedPlayer?.name}
                            />
                        ) : (
                            <VotingTable playerChoices={playerChoices} />
                        )}

                        <div>
                            <h2 className='text-2xl mb-4'>Real Question:</h2>
                            <QuestionCard
                                size={'small'}
                                question={questions.normalQuestion}
                            />
                        </div>
                    </>
                )}
            </div>
            {!counter > 0 && ownPlayer?.host && (
                <button
                    className={
                        'text-black text-center text-lg py-2 px-6 border border-black rounded shadow-sm shadow-black bg-zinc-500 mt-14'
                    }
                    onClick={() => startBlamePhase()}
                >
                    Next
                </button>
            )}
        </>
    );
};

export default Discussion;
