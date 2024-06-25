import { useState } from 'react';
import Button from '../components/Button';
import StartGame from '../components/StartGame';
import TextInput from '../components/ui/TextInput';

const Join = () => {
    const [gameId, setGameId] = useState(null);
    const [playerName, setPlayerName] = useState('');

    return (
        <div className='flex flex-col gap-20 items-center'>
            <StartGame>
                <h1 className='text-xl text-center'>
                    Join a game simply entering the room ID your friends shared
                    with you.
                </h1>
                <div>
                    <TextInput
                        placeholder={'Enter your Name'}
                        value={playerName}
                        setValue={e => setPlayerName(e.target.value)}
                        displayName={'Your Name'}
                    />
                </div>
                <div>
                    <TextInput
                        placeholder={'Paste the room id'}
                        value={gameId}
                        setValue={e => setGameId(e.target.value)}
                        displayName={'Room ID'}
                    />
                </div>
                <Button
                    color={'#1B998B'}
                    className='text-white text-center text-xl py-4 w-full border border-black rounded shadow-sm shadow-black'
                >
                    Join Game
                </Button>
            </StartGame>
        </div>
    );
};

export default Join;
