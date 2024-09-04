import { useAutoAnimate } from '@formkit/auto-animate/react';
import clipboardCopy from 'clipboard-copy';
import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import IdCard from '../components/IdCard';
import PlayerCard from '../components/PlayerCard';
import SettingsModal from '../components/SettingsModal';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { gameOptionsAtom, whoWonAtom } from '../store/game';
import { playerAtom } from '../store/player';
import { questionsAtom } from '../store/questions';
import { roomAtom } from '../store/room';
import instantDBAtom from '../store/db';
import { lobbyCodeAtom } from '../store/lobby';
import { tx } from '@instantdb/react';

const Lobby = () => {
    const navigate = useNavigate();
    const [db] = useAtom(instantDBAtom);

    const [player, setPlayer] = useAtom(playerAtom);
    const [lobbyCode] = useAtom(lobbyCodeAtom);

    const { isLoading, error, data } = db.useQuery({
        lobby: {
            $: {
                where: { lobbyCode }
            },
            players: {}
        }
    });

    const [lobby] = data?.lobby || [];
    const isHost = lobby?.players[0]?.id === player.id;

    const [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ] = useToast();

    const [showOptions, setShowOptions] = useState(false);

    const [parent] = useAutoAnimate();

    const copyIdToClipboard = () => {
        clipboardCopy(lobbyCode);
        showToastWithMessage('Copied ID to Clipboard');
    };

    const onLeaveLobby = () => {
        // if only one player in the lobby, delete the lobby

        db.transact([tx.players[player.id].delete()]);
        if (lobby.players.length === 1) {
            db.transact([tx.lobby[lobby.id].delete()]);

            navigate('/');
        } else {
            navigate('/');
        }

        // e.preventDefault();
        // socket.emit('leaveLobby', ownPlayer.id);
        // setOwnPlayer({ ...ownPlayer, state: { roomId: undefined } });
        // setRoom({ id: undefined, users: [] });
        // navigate('/');
    };

    const startGame = () => {
        if (lobby.players.length < 2) {
            showToastWithMessage('You need at least 3 Players', 'error');
            return;
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className='flex flex-col justify-between gap-4 h-full w-full items-center'>
                <div className='flex flex-col gap-8 w-full'>
                    <IdCard
                        gameId={lobbyCode}
                        host={isHost}
                        copyIdToClipboard={copyIdToClipboard}
                        openOptions={() => setShowOptions(true)}
                    />

                    <SettingsModal
                        isOpen={showOptions}
                        close={() => setShowOptions(false)}
                    />

                    <div className='w-full flex flex-col gap-1'>
                        <h2 className='text-xl text-teal-700'>Players</h2>
                        <ul
                            className='flex flex-col gap-2 items-center overflow-y-auto'
                            ref={parent}
                        >
                            {/* <PlayerCard
                            name={player.name}
                            host={player.isHost}
                            backgroundColor='rgb(52 211 153)'
                        /> */}
                            {lobby.players.map((user, index) => (
                                <PlayerCard
                                    key={user.id}
                                    name={user.name}
                                    host={index === 0}
                                    backgroundColor={
                                        index === 0
                                            ? 'rgb(103 232 249)' // Host color
                                            : user.id === player.id
                                              ? 'rgb(52 211 153)' // Current player color
                                              : 'rgb(254 240 138)' // Other players color
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-full'>
                    {player.id && (
                        <Button handler={startGame}>Start Game</Button>
                    )}

                    <button
                        onClick={onLeaveLobby}
                        className='text-2xl font-bold text-neutral-600 bg-white/80 border-2 rounded-md border-neutral-400 p-2'
                    >
                        Leave
                    </button>
                </div>
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

export default Lobby;
