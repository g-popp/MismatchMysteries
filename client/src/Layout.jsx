import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='flex flex-col p-12 items-center'>
            <Link to='/'>
                <h1 className='text-3xl underline basis-4/5 text-center mb-12 text-teal-600'>
                    Friends Don&apos;t Lie
                </h1>
            </Link>

            <Outlet />
        </div>
    );
};

export default Layout;
