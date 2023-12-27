const PlayerCard = ({ name, backgroundColor, host }) => {
    return (
        <div
            className=' flex justify-between w-full p-2 border border-black rounded-md text-black shadow-md text-xl'
            style={{ backgroundColor: backgroundColor }}
        >
            <span>{name}</span>
            <span className='text-black'>{host ? 'Game Host' : ''}</span>
        </div>
    );
};

export default PlayerCard;
