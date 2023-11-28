import ShortUniqueId from 'short-unique-id';
import clipboard from '../assets/clipboard.png';

const NewGame = () => {
    const { randomUUID } = new ShortUniqueId({ length: 8 });

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
                    <li className='text-xl'>Player 1</li>
                    <li className='text-xl'>Player 2</li>
                    <li className='text-xl'>Player 3</li>
                    <li className='text-xl'>Player 4</li>
                </ul>
            </div>
            <button className='bg-[#1B998B] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'>
                Start Game
            </button>
        </div>
    );
};

export default NewGame;
