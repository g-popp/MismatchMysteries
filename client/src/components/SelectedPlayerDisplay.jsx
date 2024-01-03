/* eslint-disable react/prop-types */
const SelectedPlayerDisplay = ({ selectedPlayerName }) => {
    return (
        <h2 className=' flex flex-col gap-8 text-3xl items-center'>
            You chose:{' '}
            <span className='text-violet-400 text-8xl'>
                {selectedPlayerName ? selectedPlayerName : 'No one yet'}
            </span>
        </h2>
    );
};

export default SelectedPlayerDisplay;
