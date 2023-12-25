/* eslint-disable react/prop-types */
import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/socket';
import { playerAtom } from '../store/players';
import Button from './Button';
import Toast from './Toast';

const ChoosePlayer = ({ players }) => {
    const socket = useContext(SocketContext);

    const [selectedButton, setSelectedButton] = useState(null);
    const [ownPlayer] = useAtom(playerAtom);
    const [showToast, setShowToast] = useState(false);

    const handleButtonClick = buttonId => {
        setSelectedButton(buttonId);

        socket.emit('choosePlayer', { playerId: buttonId });
    };

    useEffect(() => {
        if (socket) {
            socket.on('allPlayersChosen', () => {
                setShowToast(true);
            });
        }
    }, [ownPlayer, socket]);

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4 mb-6'>
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

            {ownPlayer.host && (
                <Button color='#10b981' handler={() => {}}>
                    Skip
                </Button>
            )}

            <Toast
                message={'All Player selected someone'}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default ChoosePlayer;
