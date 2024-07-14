/* eslint-disable react/prop-types */
import { CopySimple, GearSix } from '@phosphor-icons/react';

const IdCard = ({ gameId, host, copyIdToClipboard, openOptions }) => {
    return (
        <div className='flex gap-2 justify-between items-center w-full'>
            <div>
                <h2 className='text-xl text-teal-700'>Game lobby</h2>
                <span className='text-neutral-600'>{gameId}</span>
            </div>

            <div className='flex gap-2'>
                <button
                    className='border-2 border-teal-700 bg-white p-2 rounded-lg shadow-sm'
                    onClick={copyIdToClipboard}
                >
                    <CopySimple
                        weight='bold'
                        size='1.25rem'
                        className='fill-teal-800 color-teal-800'
                    ></CopySimple>
                </button>
                {host && (
                    <div
                        className='border-2 border-teal-700 bg-white p-2 rounded-lg shadow-sm'
                        onClick={openOptions}
                    >
                        <GearSix
                            weight='bold'
                            size='1.25rem'
                            className='fill-teal-800 color-teal-800'
                        ></GearSix>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdCard;
