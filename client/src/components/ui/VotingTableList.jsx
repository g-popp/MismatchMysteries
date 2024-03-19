/* eslint-disable react/prop-types */
import { colors } from '../../constants/colors';
import { sortArray } from '../utils/sortArray';

const createPlayerBundle = playerChoices => {
    return playerChoices.reduce((bundle, choice) => {
        const existingBundle = bundle.find(
            bundleItem => bundleItem[0].choice.name === choice.choice.name
        );
        if (existingBundle) {
            existingBundle.push(choice);
        } else {
            bundle.push([choice]);
        }
        return bundle;
    }, []);
};

const VotingTableList = ({ playerChoices }) => {
    const playerBundle = createPlayerBundle(playerChoices);

    const sortedPlayerBundle = sortArray(playerBundle, 'length');

    return sortedPlayerBundle.map((bundle, colorIndex) => {
        return bundle.map((player, playerIndex) => (
            <tr
                key={playerIndex}
                style={{
                    backgroundColor: colors[`rowColor-${colorIndex % 4}`]
                }}
            >
                <td className='text-center text-black border-r-2 border-b-2 border-l-2 border-black font-bold'>
                    {player.chooser.name}
                </td>
                <td className='text-center text-black border-b-2 border-r-2 border-black'>
                    {player.choice.name}
                </td>
            </tr>
        ));
    });
};

export default VotingTableList;
