import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='flex flex-col p-8 items-center'>
            <h1 className='text-6xl underline py-24 text-center'>
                Mismatched Mysteries
            </h1>
            <div className='flex flex-col gap-14'>
                <Link
                    to='newGame'
                    className='bg-[#FFFD82] text-black text-center text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                >
                    Start New Game
                </Link>
                <Link
                    to='join'
                    className='bg-[#E84855] text-black text-center text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                >
                    Join Lobby
                </Link>
            </div>
        </div>
    );
};

export default Home;
