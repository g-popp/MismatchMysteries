import { useAtom } from 'jotai';
import { playersAtom } from '../store/players';

const ChoosePlayer = () => {
    const [players] = useAtom(playersAtom);

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4'>
                {players.map(player => (
                    <div
                        key={player.id}
                        className={`bg-[${player.backgroundColor}] rounded-lg shadow-xl p-4`}
                    >
                        <h2 className='text-2xl text-center text-black'>
                            {player.name}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChoosePlayer;
