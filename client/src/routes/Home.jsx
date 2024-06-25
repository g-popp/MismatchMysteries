import { Link } from 'react-router-dom';

import Logo from '../assets/logo.svg';

const Home = () => {
    return (
        <div className='flex flex-col p-8 mt-8 items-center gap-40'>
            <h1 className='text-6xl text-black underline text-center'>
                Friends Don&apos;t Lie
            </h1>
            <img src={Logo} className='w-10/12 lg:w-1/3' />
            <Link
                to='/join'
                className={
                    'text-black text-center text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black bg-teal-600'
                }
            >
                Play Now
            </Link>
        </div>
    );
};

export default Home;
