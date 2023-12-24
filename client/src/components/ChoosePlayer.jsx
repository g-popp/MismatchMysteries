/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import { SocketContext } from '../context/socket';

const ChoosePlayer = ({ players }) => {
    const socket = useContext(SocketContext);

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = buttonId => {
        setSelectedButton(buttonId);

        socket.emit('choosePlayer', { playerId: buttonId });
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
                        // style={{ backgroundColor: color }}
                        onClick={() => handleButtonClick(player.id)}
                    >
                        {player.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChoosePlayer;
