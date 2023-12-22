/* eslint-disable react/prop-types */
import Button from '../components/Button';

const ChoosePlayer = ({ players }) => {
    // const [players] = useAtom(playersAtom);

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4'>
                {players.map(player => (
                    <Button key={player.id} color='bg-[#FFFD82]'>
                        {player.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChoosePlayer;
