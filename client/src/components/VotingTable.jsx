/* eslint-disable react/prop-types */
const VotingTable = ({ playerChoices }) => {
    return (
        <h1 className='text-xl'>
            {playerChoices ? (
                playerChoices.map(choice => (
                    <p key={choice.chooser.id}>
                        {choice.chooser.name} chose {choice.chosen.name}
                    </p>
                ))
            ) : (
                <p>Error</p>
            )}
        </h1>
    );
};

export default VotingTable;
