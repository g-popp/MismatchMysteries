/* eslint-disable react/prop-types */
import VotingTableList from './ui/VotingTableList';

const VotingTable = ({ playerChoices }) => {
    const commonStyles = 'border-2 border-black px-10 py-5 text-center';

    if (playerChoices.length === 0) return <p>Loading...</p>;

    return (
        <h1 className='text-xl'>
            <div className='border border-white rounded-lg p-2'>
                <table className='border-collapse w-full'>
                    <thead>
                        <tr className='bg-gray-800'>
                            <th className={commonStyles}>Player</th>
                            <th className={commonStyles}>Choices</th>
                        </tr>
                    </thead>
                    <tbody>
                        <VotingTableList playerChoices={playerChoices} />
                    </tbody>
                </table>
            </div>
        </h1>
    );
};

export default VotingTable;
