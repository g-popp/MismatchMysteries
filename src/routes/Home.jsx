import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { SocketContext } from '../context/socket';
import { gameIdAtom } from '../store/game';
import { nameAtom } from '../store/name';

const Home = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();
    const [name, setName] = useAtom(nameAtom);
    const [, setGameId] = useAtom(gameIdAtom);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const createLobby = () => {
        socket && socket.emit('createLobby');
    };

    const setToastError = () => {
        setToastMessage('Name is missing');
        setShowToast(true);
    };

    const handleNewGame = e => {
        e.preventDefault();

        if (!name) {
            return setToastError();
        }

        createLobby();
    };

    const handleJoinLobby = e => {
        e.preventDefault();

        if (!name) {
            return setToastError();
        }

        navigate('/join');
    };

    useEffect(() => {
        socket &&
            socket.on('lobbyCreated', roomId => {
                setGameId(roomId);
                navigate(`/newGame/${roomId}`);
            });
    }, [socket]);

    return (
        <div className='flex flex-col p-8 items-center gap-8'>
            <h1 className='text-6xl underline py-20 text-center'>
                Mismatched Mysteries
            </h1>
            <h2 className='text-xl mb-8'>Enter a Name to start a game!</h2>
            <div>
                <div className='relative h-12 w-full min-w-[200px]'>
                    <input
                        placeholder='...'
                        value={name}
                        form='username'
                        className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-[#1B998B] focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                        onChange={e => setName(e.target.value)}
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
                <Button color='1B998B' handler={e => handleNewGame(e)}>
                    Start New Game
                </Button>
                <Button color='E84855' handler={e => handleJoinLobby(e)}>
                    Join Lobby
                </Button>
            </div>
            <Toast
                message={toastMessage}
                type='error'
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Home;
