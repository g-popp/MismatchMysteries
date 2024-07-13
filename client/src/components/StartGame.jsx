import { Link, useLocation } from 'react-router-dom';

/* eslint-disable react/prop-types */
const StartGame = ({ children }) => {
    const location = useLocation();

    const activeButton =
        'text-center text-xl py-3 px-10 text-white bg-teal-600 border-teal-800 hover:bg-teal-700 border-2 rounded-full shadow-md shadow-teal-700/50 transition';

    const inactiveButton =
        'text-center text-xl py-3 px-10 text-teal-600 bg-white border-teal-800 hover:text-teal-700 hover:bg-teal-50 border-2 rounded-full transition';

    return (
        <div className='flex flex-col justify-between h-full items-center'>
            <div className='flex gap-8'>
                <Link
                    to='/join'
                    className={
                        location.pathname === '/join'
                            ? activeButton
                            : inactiveButton
                    }
                >
                    Join
                </Link>
                <Link
                    to='/host'
                    className={
                        location.pathname === '/host'
                            ? activeButton
                            : inactiveButton
                    }
                >
                    Host
                </Link>
            </div>
            {children}
        </div>
    );
};

export default StartGame;
