import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { useToast } from '../hooks/useToast';
import { playerAtom } from '../store/players';
import { roomAtom } from '../store/room';

const Home = () => {
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

    const setToastError = () =>
        showToastWithMessage('Please enter a name', 'error');

    const handleNewGame = e => {
        e.preventDefault();

        if (!ownPlayer.name) {
            return setToastError();
        }

        socket.emit('createLobby', ownPlayer.name);
    };

    const handleJoinLobby = e => {
        e.preventDefault();

        if (!ownPlayer.name) {
            return setToastError();
        }

        navigate('/join');
    };

    // TODO: implement resume game
    const handleResumeGame = e => {
        e.preventDefault();

        if (!ownPlayer.name) {
            return setToastError();
        }

        navigate(`/lobby/${ownPlayer.state.roomId}`);
    };

    const handleLeaveLobby = e => {
        e.preventDefault();

        socket.emit('leaveLobby', ownPlayer.id);

        setOwnPlayer({ ...ownPlayer, state: { roomId: undefined } });

        setRoom({ id: undefined, users: [] });

        navigate('/');
    };

    useEffect(() => {
        if (socket) {
            socket.on('lobbyCreated', room => {
                setRoom(room);

                socket.on('playerInfo', player => {
                    setOwnPlayer(player);
                    setPlayerSet(true);
                });
            });

            socket.on('error', message => {
                console.error(message);
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
        <div className='flex flex-col p-8 items-center gap-8'>
            <h1 className='text-6xl underline py-20 text-center'>
                Friends Don&apos;t Lie
            </h1>
            <h2 className='text-xl mb-8'>Enter a Name to start a game!</h2>
            <div>
                <div className='relative h-12 w-full min-w-[200px]'>
                    <input
                        placeholder='...'
                        value={ownPlayer.name}
                        form='username'
                        className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-[#1B998B] focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                        onChange={e =>
                            setOwnPlayer({ ...ownPlayer, name: e.target.value })
                        }
                    />
                    <label
                        name='username'
                        className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-[#1B998B] after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-[#1B998B] peer-focus:after:scale-x-100 peer-focus:after:border-[#1B998B] peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                    >
                        Name
                    </label>
                </div>
            </div>
            <div className='flex flex-col gap-14'>
                {!ownPlayer.state.roomId ? (
                    <>
                        <Button color='#1B998B' handler={e => handleNewGame(e)}>
                            Start New Game
                        </Button>
                        <Button
                            color='#E84855'
                            handler={e => handleJoinLobby(e)}
                        >
                            Join Lobby
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            color='#1B998B'
                            handler={e => handleResumeGame(e)}
                        >
                            Resume Game
                        </Button>
                        <Button
                            color='#E84855'
                            handler={e => handleLeaveLobby(e)}
                        >
                            Leave
                        </Button>
                    </>
                )}
            </div>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={hideToast}
            />
        </div>
    );
};

export default Home;
