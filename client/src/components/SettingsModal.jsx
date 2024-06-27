/* eslint-disable react/prop-types */
import { useAtom } from 'jotai';
import { createPortal } from 'react-dom';
import { gameOptionsAtom } from '../store/game';
import Button from './Button';

const SettingsModal = ({ isOpen, close }) => {
    const [gameOptions, setGameOptions] = useAtom(gameOptionsAtom);

    const setCouchMode = () => {
        setGameOptions(prevOptions => ({
            ...prevOptions,
            couchMode: !prevOptions.couchMode
        }));
    };

    const increaseNumberOfImposters = () => {
        if (gameOptions.numberOfImposters === 3) return;

        setGameOptions(prevOptions => ({
            ...prevOptions,
            numberOfImposters: prevOptions.numberOfImposters + 1
        }));
    };

    const decreaseNumberOfImposters = () => {
        if (gameOptions.numberOfImposters === 1) return;

        setGameOptions(prevOptions => ({
            ...prevOptions,
            numberOfImposters: prevOptions.numberOfImposters - 1
        }));
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            onClick={close}
            className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'
        >
            <div
                onClick={e => e.stopPropagation()}
                className='bg-black p-10 border rounded-lg relative w-4/5 max-w-3xl max-h-screen-xl z-20'
            >
                <form className='flex flex-col gap-10'>
                    <h2 className='text-4xl mx-auto underline text-teal-600'>
                        Options
                    </h2>

                    <div>
                        <p className='mb-4 text-sm text-white text-center'>
                            Choose Game Mode:
                        </p>
                        <div className='flex justify-around'>
                            <p
                                className={
                                    !gameOptions.couchMode
                                        ? 'text-gray-400'
                                        : 'text-white'
                                }
                            >
                                Couch
                            </p>
                            <label className='relative inline-flex items-center cursor-pointer'>
                                <input
                                    type='checkbox'
                                    onClick={setCouchMode}
                                    className='sr-only peer'
                                    checked={!gameOptions.couchMode}
                                />
                                <div className="w-11 h-6 rounded-full peer bg-yellow-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                            </label>
                            <p
                                className={
                                    gameOptions.couchMode
                                        ? 'text-gray-400'
                                        : 'text-white'
                                }
                            >
                                Online
                            </p>
                        </div>
                    </div>

                    <div className='mx-auto'>
                        <label className='block mb-4 text-sm text-white'>
                            Choose number of Imposter(s):
                        </label>

                        <div className='relative flex items-center max-w-[11rem] mx-auto mb-4'>
                            <MinusButton decrease={decreaseNumberOfImposters} />

                            <input
                                type='text'
                                id='bedrooms-input'
                                readOnly
                                className='border-x-0 h-11 text-center  text-md  block w-full pb-6 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-0 focus:border-gray-600'
                                placeholder=''
                                value={gameOptions.numberOfImposters}
                            />
                            <div className='absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-white space-x-1 rtl:space-x-reverse'>
                                <span>
                                    {gameOptions.numberOfImposters > 1
                                        ? 'Imposters'
                                        : 'Imposter'}
                                </span>
                            </div>

                            <PlusButton increase={increaseNumberOfImposters} />
                        </div>
                        <p
                            id='helper-text-explanation'
                            className='mt-2 text-sm text-gray-400 w-full text-center'
                        >
                            Amount of Imposters
                            <br /> depends on the number of players
                        </p>
                    </div>

                    <Button handler={close} color='#E84855'>
                        Close
                    </Button>
                </form>
            </div>
        </div>,
        document.body
    );
};

const MinusButton = ({ decrease }) => {
    return (
        <button
            type='button'
            id='decrement-button'
            className=' bg-gray-700 hover:bg-gray-600 border-gray-600 border rounded-s-lg p-3 h-11 focus:ring-0 focus:outline-none'
            onClick={decrease}
        >
            <svg
                className='w-3 h-3 text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 18 2'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 1h16'
                />
            </svg>
        </button>
    );
};

const PlusButton = ({ increase }) => {
    return (
        <button
            type='button'
            id='increment-button'
            className=' bg-gray-700 hover:bg-gray-600 border-gray-600 border rounded-e-lg p-3 h-11 focus:ring-0 focus:outline-none'
            onClick={increase}
        >
            <svg
                className='w-3 h-3 text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 18 18'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 1v16M1 9h16'
                />
            </svg>
        </button>
    );
};

export default SettingsModal;
