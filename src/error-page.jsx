import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div id='error-page' className='flex flex-col p-8 items-center'>
            <h1 className='text-6xl underline py-24 text-center'>Oops!</h1>
            <div className='flex flex-col items-center gap-8'>
                <p className='text-2xl text-center'>
                    Sorry, an unexpected error has occurred.
                </p>
                <p className='text-xl text-red-500 underline'>
                    {error.statusText || error.message}
                </p>
                <Link
                    to='/'
                    className='mt-4 bg-[#1B998B] text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                >
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
