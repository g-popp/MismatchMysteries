const PlayerCard = ({ name, backgroundColor, host }) => {
    return (
        <div
            className=' flex justify-between w-full p-2 border border-black rounded-md text-black shadow-md text-lg'
            style={{ backgroundColor: backgroundColor }}
        >
            <span className=' overflow-ellipsis whitespace-nowrap overflow-hidden max-w-[120px]'>
                {name}
            </span>
            <span className='text-gray-500'>{host ? 'Game Host' : ''}</span>
        </div>
    );
};

export default PlayerCard;
