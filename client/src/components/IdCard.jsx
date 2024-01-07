/* eslint-disable react/prop-types */
import clipboard from '../assets/clipboard.png';
import settings from '../assets/setting.png';

const IdCard = ({ gameId, host, copyIdToClipboard, openOptions }) => {
    return (
        <div className='flex flex-row gap-6 items-center'>
            <h2 className='text-3xl'>ID: {gameId}</h2>
            <div
                className='border border-black opacity-50 bg-[#1B998B] p-2 rounded-lg shadow-md hover:cursor-pointer'
                onClick={copyIdToClipboard}
            >
                <img src={clipboard} alt='copy link' className='h-5' />
            </div>
            {host && (
                <div
                    className='border border-black opacity-70 bg-[#FFFD82] p-2 rounded-lg shadow-md hover:cursor-pointer'
                    onClick={openOptions}
                >
                    <img
                        src={settings}
                        alt='settings link'
                        className=' h-5 opacity-60'
                    />
                </div>
            )}
        </div>
    );
};

export default IdCard;
