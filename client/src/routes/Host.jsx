import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import instantDBAtom from '../store/db';
import { lobbyCodeAtom, lobbyStateAtom } from '../store/lobby';
import Button from '../components/Button';
import StartGame from '../components/StartGame';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import TextInput from '../components/ui/TextInput';
import { playerAtom } from '../store/player';
import { tx, id } from '@instantdb/react';

const Host = () => {
    const navigate = useNavigate();

    const [lobbyCode, setLobbyCode] = useAtom(lobbyCodeAtom);
    const [db] = useAtom(instantDBAtom);
    const [player, setPlayer] = useAtom(playerAtom);

    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const createLobby = async () => {
        const lobbyId = id();
        const playerId = id();

        setLobbyCode(lobbyId.slice(0, 6));
        setPlayer({ ...player, id: playerId });

        if (!player.name) {
            showToastWithMessage('Please enter a name', 'error');
            return;
        }

        await db.transact([
            tx.lobby[lobbyId].update({
                lobbyCode: lobbyCode,
                players: [{ name: player.name, id: player.id, host: true }],
                status: 'waiting'
            })
        ]);

        navigate(`/lobby/${lobbyCode}`);
    };

    return (
        <div className='flex flex-col h-full justify-between items-center'>
            <StartGame>
                <div className='flex flex-col gap-14'>
                    <p className='text-xl text-center'>
                        Create a room to play together with your friends. Just
                        share the room ID, which you get on the next screen.
                    </p>
                    <TextInput
                        placeholder={'Enter your Name'}
                        value={player.name}
                        setValue={e =>
                            setPlayer({ ...player, name: e.target.value })
                        }
                        displayName={'Your Name'}
                    />
                </div>
                <Button handler={createLobby}>Create Game</Button>
            </StartGame>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={hideToast}
            />
        </div>
    );
};

export default Host;
