import { useState } from 'react';
import Button from '../components/Button';
import StartGame from '../components/StartGame';
import TextInput from '../components/ui/TextInput';

const Host = () => {
    const [playerName, setPlayerName] = useState('');

    return (
        <div className='flex flex-col gap-20 items-center'>
            <StartGame>
                <h1 className='text-xl text-center'>
                    Create a room to play together with your friends. Just share
                    the room ID, which you get on the next screen.
                </h1>
                <TextInput
                    placeholder={'Enter your Name'}
                    value={playerName}
                    setValue={e => setPlayerName(e.target.value)}
                    displayName={'Your Name'}
                />
                <Button
                    color={'#1B998B'}
                    className='text-white text-center text-xl py-4 w-full border border-black rounded shadow-sm shadow-black'
                >
                    Join Room
                </Button>
            </StartGame>
        </div>
    );
};

export default Host;
