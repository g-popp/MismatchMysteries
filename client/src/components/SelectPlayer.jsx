/* eslint-disable react/prop-types */
import { useState } from 'react';

const SelectPlayer = ({ players, setPlayer }) => {
    const [selectedButton, setSelectedButton] = useState();

    const handleButtonClick = playerId => {
        setSelectedButton(playerId);
        setPlayer(playerId);
    };

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4'>
                {players.map(player => (
                    <button
                        key={player.id}
                        type='button'
                        className={`text-black text-center text-xl py-4 px-6 border border-black rounded shadow-sm ${
                            selectedButton === player.id
                                ? ' bg-emerald-500'
                                : 'bg-zinc-500'
                        }`}
                        onClick={() => handleButtonClick(player.id)}
                    >
                        {player.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SelectPlayer;
