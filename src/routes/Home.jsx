import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='flex flex-col p-8 items-center gap-8'>
            <h1 className='text-6xl underline py-20 text-center'>
                Mismatched Mysteries
            </h1>
            <div>
                <div className='relative h-12 w-full min-w-[200px]'>
                    <input
                        placeholder='...'
                        className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-[#1B998B] focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                    />
                    <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-[#1B998B] after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-[#1B998B] peer-focus:after:scale-x-100 peer-focus:after:border-[#1B998B] peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Name
                    </label>
                </div>
            </div>
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
