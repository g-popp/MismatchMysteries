import { useAtom } from 'jotai';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clipboard from '../assets/clipboard.png';
import PlayerCard from '../components/PlayerCard';
import { SocketContext } from '../context/socket';
import { gameIdAtom } from '../store/game';
import { nameAtom } from '../store/name';
import { playersAtom } from '../store/players';

const NewGame = () => {
    const socket = useContext(SocketContext);

    const [name] = useAtom(nameAtom);
    const [gameId] = useAtom(gameIdAtom);
    const [players] = useAtom(playersAtom);

    useEffect(() => {
        if (gameId && socket) {
            socket.emit('checkRoom', gameId);

            socket.on('roomExists', exists => {
                if (exists) {
                    console.log('Room exists');
                } else {
                    console.log('Room does not exist');
                }
            });
        }
    }, []);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game Lobby</h1>
            <div className='flex flex-row gap-6 items-center'>
                <h2 className='text-4xl'>ID: {gameId}</h2>
                <div className='border border-black opacity-50 p-2 rounded-lg shadow-md hover:cursor-pointer'>
                    <img
                        src={clipboard}
                        alt='copy link'
                        className='h-6 opacity-80'
                    />
                </div>
            </div>
            <div className='border rounded-lg'>
                <h2 className='text-2xl p-4'>Players:</h2>
                <ul className='flex flex-col gap-2 w-64 h-32  items-center m-2 overflow-y-scroll'>
                    <PlayerCard name={name} backgroundColor='#FFFD82' />
                    {players.map(player => (
                        <PlayerCard
                            key={player.id}
                            name={player.name}
                            backgroundColor={player.backgroundColor}
                        />
                    ))}
                </ul>
            </div>
            <Link
                to='/game'
                className='bg-[#1B998B] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
            >
                Start Game
            </Link>
        </div>
    );
};

export default NewGame;
