const PlayerCard = ({ name, backgroundColor, host }) => {
    return (
        <div
            className='flex justify-between w-full py-2 px-4 border-2 border-neutral-500 rounded-md text-neutral-800 text-lg items-center'
            style={{ backgroundColor: backgroundColor }}
        >
            <span className=' overflow-ellipsis whitespace-nowrap overflow-hidden max-w-[120px]'>
                {name}
            </span>
            <span className='text-neutral-600 text-base'>
                {host ? 'Game Host' : ''}
            </span>
        </div>
    );
};

export default PlayerCard;
