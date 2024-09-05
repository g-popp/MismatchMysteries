/* eslint-disable react/prop-types */
const SelectedPlayerDisplay = ({ selectedPlayerName }) => {
    return (
        <h2 className=' flex flex-col text-xl gap-2 items-center'>
            You chose:{' '}
            <p className='text-violet-400 text-7xl'>
                {selectedPlayerName ? selectedPlayerName : 'No one yet'}
            </p>
        </h2>
    );
};

export default SelectedPlayerDisplay;
