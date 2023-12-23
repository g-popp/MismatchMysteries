/* eslint-disable react/prop-types */
import Button from '../components/Button';
import useRandomColor from '../hooks/useRandomColor';

const ChoosePlayer = ({ players }) => {
    const [color] = useRandomColor();

    console.log(color);

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4'>
                {players.map(player => (
                    <Button key={player.id} color={color}>
                        {player.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChoosePlayer;
