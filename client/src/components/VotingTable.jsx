/* eslint-disable react/prop-types */
import { colors } from '../constants/colors';

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
                        {playerChoices.map((choice, index) => {
                            return (
                                <tr
                                    key={choice.chooser.id}
                                    style={{
                                        backgroundColor:
                                            colors[`rowColor-${index % 4}`]
                                    }}
                                >
                                    <td className='text-center text-black border-r-2 border-b-2 border-l-2 border-black font-bold'>
                                        {choice.chooser.name}
                                    </td>
                                    <td className='text-center text-black border-b-2 border-r-2 border-black'>
                                        {choice.chosen.name}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </h1>
    );
};

export default VotingTable;
