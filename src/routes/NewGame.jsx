import { useAtom } from 'jotai';
import ShortUniqueId from 'short-unique-id';
import clipboard from '../assets/clipboard.png';
import PlayerCard from '../components/PlayerCard';
import { nameAtom } from '../store/name';

const NewGame = () => {
    const { randomUUID } = new ShortUniqueId({ length: 8 });
    const [name] = useAtom(nameAtom);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game Lobby</h1>
            <div className='flex flex-row gap-6 items-center'>
                <h2 className='text-4xl'>ID: {randomUUID()}</h2>
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
                    <PlayerCard name={name} backgroundColor={'#FFFD82'} />
                    <PlayerCard name='Player1' backgroundColor={'#E84855'} />
                    <PlayerCard name='Player2' backgroundColor={'#FF9B73'} />
                    <PlayerCard name='Player3' backgroundColor={'#1B998B'} />
                </ul>
            </div>
            <button className='bg-[#1B998B] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'>
                Start Game
            </button>
        </div>
    );
};

export default NewGame;
