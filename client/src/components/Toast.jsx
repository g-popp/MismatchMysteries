import { Transition } from '@headlessui/react';
import { useEffect } from 'react';

const Toast = ({ message, type, show, onClose }) => {
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <Transition
            show={show}
            enter='transition-opacity duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
        >
            <div
                className={`fixed bottom-5 inset-x-0 mx-auto w-48 p-4 ${bgColor} text-white text-center rounded-lg shadow-lg flex justify-center`}
            >
                {message}
            </div>
        </Transition>
    );
};

export default Toast;
