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

const Join = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [room, setRoom] = useAtom(roomAtom);
    const [isPlayerSet, setIsPlayerSet] = useState(false);

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
    const handleJoinGame = useCallback(
        e => {
            e.preventDefault();
            if (!ownPlayer.name) {
                setToastError("'Please enter a name'");
            } else if (!room.id) {
                setToastError('Please enter a room id');
            } else {
                socket.emit('joinLobby', {
                    roomId: room.id,
                    name: ownPlayer.name
                });
            }
        },
        [ownPlayer.name, room.id, setToastError, socket]
    );

    useEffect(() => {
        if (socket) {
            socket.on('error', error => setToastError(error));

            socket.on('playerInfo', player => {
                setOwnPlayer(player);

                socket.on('updateLobby', room => {
                    setRoom(room);
                    setIsPlayerSet(true);
                });
            });

            return () => {
                socket.off('error');
                socket.off('updateLobby');
            };
        }

        return () => {
            socket.off('error');
        };
    }, [socket]);

    useEffect(() => {
        if (isPlayerSet && room.id) {
            navigate(`/lobby/${room.id}`);
        }
    }, [isPlayerSet, room]);

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
                        value={ownPlayer.name}
                        setValue={e =>
                            setOwnPlayer({ ...ownPlayer, name: e.target.value })
                        }
                        displayName={'Your Name'}
                    />
                    <TextInput
                        placeholder={'Paste the room id'}
                        value={room.id}
                        setValue={e => setRoom({ ...room, id: e.target.value })}
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
