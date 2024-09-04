import { useAtom } from 'jotai';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import StartGame from '../components/StartGame';
import Toast from '../components/Toast';
import TextInput from '../components/ui/TextInput';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { playerAtom } from '../store/player';
import { roomAtom } from '../store/room';
import { lobbyCodeAtom } from '../store/lobby';
import instantDBAtom from '../store/db';
import { lookup, tx, id } from '@instantdb/react';

const Join = () => {
    const navigate = useNavigate();
    const [db] = useAtom(instantDBAtom);

    const [player, setPlayer] = useAtom(playerAtom);
    const [lobbyCode, setLobbyCode] = useAtom(lobbyCodeAtom);

    const { data, error } = db.useQuery({
        lobby: {
            $: { where: { lobbyCode } }
        }
    });

    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const setToastError = useCallback(
        message => showToastWithMessage(message, 'error'),
        [showToastWithMessage]
    );

    const handleJoinGame = () => {
        const playerId = id();
        const updatedPlayer = { ...player, id: playerId };

        if (!player.name || !playerId) {
            setToastError('Please enter a name');
            return;
        }

        setPlayer(updatedPlayer);

        if (!lobbyCode) {
            setToastError('Please enter a lobby code');
            return;
        }

        db.transact([
            tx.players[updatedPlayer.id].update(updatedPlayer),
            tx.lobby[lookup('lobbyCode', lobbyCode)].link({
                players: updatedPlayer.id
            })
        ]);

        const [lobby] = data?.lobby || [];

        if (lobby?.lobbyCode !== lobbyCode) {
            setToastError('Invalid lobby code');
        } else {
            navigate(`/lobby/${lobbyCode}`);
        }
    };

    return (
        <div className='flex flex-col h-full justify-between items-center'>
            <StartGame>
                <div className='flex flex-col gap-14'>
                    <p className='text-xl text-center'>
                        Join a game simply entering the room ID your friends
                        shared with you.
                    </p>
                    <TextInput
                        placeholder={'Enter your Name'}
                        value={player.name}
                        setValue={e =>
                            setPlayer({ ...player, name: e.target.value })
                        }
                        displayName={'Your Name'}
                    />
                    <TextInput
                        placeholder={'Paste the room id'}
                        value={lobbyCode}
                        setValue={e => setLobbyCode(e.target.value)}
                        displayName={'Room ID'}
                    />
                </div>
                <Button handler={e => handleJoinGame(e)}>Join Game</Button>
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

export default Join;
