import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='flex flex-col p-12 items-center h-full'>
            <Link to='/'>
                <h1 className='text-2xl basis-4/5 text-center mb-12 bg-clip-text text-transparent bg-gradient-to-b from-teal-600 to-teal-500 bowlby-one'>
                    Friends Don&apos;t Lie
                </h1>
            </Link>

            <Outlet />
        </div>
    );
};

export default Layout;
