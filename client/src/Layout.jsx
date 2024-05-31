import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    const headingColors = ['#FF9B71', '#1B998B', '#FFFD82', '#E84855'];
    const randomColor =
        headingColors[Math.floor(Math.random() * headingColors.length)];
    const [color] = useState(randomColor);

    return (
        <div className='flex flex-col p-12 items-center'>
            <Link to='/'>
                <h1
                    className='text-3xl underline basis-4/5 text-center mb-12'
                    style={{ color: color }}
                >
                    Friends Don&apos;t Lie
                </h1>
            </Link>

            <Outlet />
        </div>
    );
};

export default Layout;
