import { Link } from 'react-router-dom';

import Logo from '../assets/logo.svg';

const Home = () => {
    return (
        <div className='flex flex-col p-12 items-center justify-between h-full'>
            <div className='flex flex-col items-center gap-8 pt-20'>
                <h1 className='text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-teal-600 to-teal-500'>
                    Friends Don&apos;t Lie
                </h1>
                <img src={Logo} className='w-10/12 lg:w-1/2' />
            </div>

            <Link
                to='/join'
                className={
                    'w-full text-center text-3xl py-4 px-6 rounded bg-teal-600 hover:bg-teal-700 border-teal-800 border-2 text-white transition bowlby-one'
                }
            >
                Play Now
            </Link>
        </div>
    );
};

export default Home;
