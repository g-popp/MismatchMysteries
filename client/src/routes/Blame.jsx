import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SelectPlayer from '../components/SelectPlayer';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { whoWonAtom } from '../store/game';
import { playerAtom } from '../store/players';
import { roomAtom } from '../store/room';

const Blame = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [room, setRoom] = useAtom(roomAtom);
    const [ownPlayer, setOwnPlayer] = useAtom(playerAtom);
    const [whoWon, setWhoWon] = useAtom(whoWonAtom);

    const [allPlayersChosen, setAllPlayersChosen] = useState(false);
    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const players = room.users.filter(player => player.id !== ownPlayer.id);

    const setPlayerBlame = playerId => {
        setOwnPlayer(prev => ({
            ...prev,
            state: {
                ...prev.state,
                hasBlamed: true,
                blame: playerId
            }
        }));
    };

    const startRevealPhase = e => {
        e.preventDefault();

        socket.emit('startRevealPhase', room.id);
    };

    useEffect(() => {
        if (socket) {
            socket.on('updateLobby', room => {
                if (room.id !== ownPlayer.state.roomId) return;

                const user = room.users.find(user => user.id === ownPlayer.id);
                setOwnPlayer(user);

                setRoom(room);
            });

            socket.on('allPlayersBlamed', () => {
                setAllPlayersChosen(true);
                showToastWithMessage('Every Player has blamed someone');
            });

            socket.on('revealResult', result => {
                setWhoWon(result);
            });

            return () => {
                socket.off('updateLobby');
                socket.off('allPlayersBlamed');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (ownPlayer.state.blame) {
            socket.emit('blamePlayer', ownPlayer);
        }
    }, [ownPlayer.state.blame]);

    useEffect(() => {
        if (!room.isGameRunning) {
            navigate(`/lobby/${ownPlayer.state.roomId}`);
        }
    }, [room]);

    // TODO: fix this shit
    useEffect(() => {
        if (whoWon && ownPlayer.state.blame) {
            navigate('/reveal');
        }
    }, [whoWon, ownPlayer.state.blame]);

    return (
        <>
            <div className='flex flex-col gap-12 items-center justify-between h-full'>
                <>
                    <h1 className='text-xl underline'>Blame Phase</h1>
                    <h2 className='text-xl text-center'>
                        Blame the person you think is the Mismatch
                    </h2>
                    <SelectPlayer
                        players={players}
                        setPlayer={setPlayerBlame}
                    />
                </>
                <>
                    {allPlayersChosen && ownPlayer.state.isHost && (
                        <Button
                            color='#10b981'
                            handler={e => startRevealPhase(e)}
                        >
                            Next
                        </Button>
                    )}
                </>
            </div>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={hideToast}
            />
        </>
    );
};

export default Blame;
