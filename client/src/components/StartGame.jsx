import { Link, useLocation } from 'react-router-dom';

/* eslint-disable react/prop-types */
const StartGame = ({ children }) => {
    const location = useLocation();

    const activeButton =
        'text-center text-xl py-4 px-10 text-white bg-teal-600 border border-black rounded-full shadow-sm shadow-black ';

    const inactiveButton =
        "'text-center text-xl py-4 px-10 border text-teal-600 bg-white border-black rounded-full shadow-sm shadow-black '";

    return (
        <div className='flex flex-col gap-20 items-center'>
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
