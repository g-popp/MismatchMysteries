const Home = () => {
    return (
        <div className='flex flex-col p-8 items-center'>
            <h1 className='text-6xl underline py-24 text-center'>
                Mismatched Mysteries
            </h1>
            <div className='flex flex-col gap-14'>
                <button className='bg-[#FFFD82] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'>
                    Start New Game
                </button>
                <button className='bg-[#E84855] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'>
                    Join Lobby
                </button>
            </div>
        </div>
    );
};

export default Home;
