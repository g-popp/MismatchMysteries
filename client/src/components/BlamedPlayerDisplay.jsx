/* eslint-disable react/prop-types */
const BlamedPlayerDisplay = ({ blamedPlayerName }) => {
    return (
        <h2 className='text-xl items-center opacity-70'>
            You blamed:{' '}
            <span className='text-teal-600'>
                {blamedPlayerName ? blamedPlayerName : 'No one yet'}
            </span>
        </h2>
    );
};

export default BlamedPlayerDisplay;
