/* eslint-disable react/prop-types */
import { colors } from '../../constants/colors';

const VotingTableList = ({ playerChoices }) => {
    return playerChoices.map((choice, index) => (
        <tr
            key={choice.chooser.id}
            style={{
                backgroundColor: colors[`rowColor-${index % 4}`]
            }}
        >
            <td className='text-center text-black border-r-2 border-b-2 border-l-2 border-black font-bold'>
                {choice.chooser.name}
            </td>
            <td className='text-center text-black border-b-2 border-r-2 border-black'>
                {choice.chosen.name}
            </td>
        </tr>
    ));
};

export default VotingTableList;
