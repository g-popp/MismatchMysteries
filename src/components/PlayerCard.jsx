const PlayerCard = ({ name, backgroundColor }) => {
    return (
        <div
            className=' flex justify-between w-full p-2 border border-black rounded-md text-black shadow-md text-xl'
            style={{ backgroundColor: backgroundColor }}
        >
            <span>{name}</span>
            <span>x</span>
        </div>
    );
};

export default PlayerCard;
