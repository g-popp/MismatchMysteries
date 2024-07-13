import { useAtom } from 'jotai';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import StartGame from '../components/StartGame';
import Toast from '../components/Toast';
import TextInput from '../components/ui/TextInput';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { playerAtom } from '../store/players';
import { roomAtom } from '../store/room';

const Host = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);

    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const [playerSet, setPlayerSet] = useState(false);

    const setToastError = useCallback(
        () => showToastWithMessage('Please enter a name', 'error'),
        [showToastWithMessage]
    );

    const handleNewGame = useCallback(
        e => {
            e.preventDefault();
            if (!ownPlayer.name) {
                setToastError();
            } else {
                socket.emit('createLobby', ownPlayer.name);
            }
        },
        [ownPlayer.name, setToastError, socket]
    );

    useEffect(() => {
        if (socket) {
            socket.on('error', error => {
                console.log('Host Lobby error: ', error);
            });

            socket.on('lobbyCreated', room => {
                setRoom(room);

                socket.on('playerInfo', player => {
                    setOwnPlayer(player);
                    setPlayerSet(true);
                });
            });

            return () => {
                socket.off('lobbyCreated');
                socket.off('playerInfo');
                socket.off('error');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (playerSet && room.id) {
            navigate(`/lobby/${room.id}`);
        }
    }, [playerSet, room]);

    return (
        <div className='flex flex-col h-full justify-between items-center'>
            <StartGame>
                <div class='flex flex-col gap-14'>
                    <p className='text-xl text-center'>
                        Create a room to play together with your friends. Just
                        share the room ID, which you get on the next screen.
                    </p>
                    <TextInput
                        placeholder={'Enter your Name'}
                        value={ownPlayer.name}
                        setValue={e =>
                            setOwnPlayer({ ...ownPlayer, name: e.target.value })
                        }
                        displayName={'Your Name'}
                    />
                </div>
                <Button handler={e => handleNewGame(e)}>Create Game</Button>
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
