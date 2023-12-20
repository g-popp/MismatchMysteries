import { useAtom } from 'jotai';
import { playersAtom } from '../store/players';

const ChoosePlayer = () => {
    const [players] = useAtom(playersAtom);

    return (
        <div className=' grid'>
            <div className='grid grid-cols-2 gap-4'>
                {players.map(player => (
                    <button
                        key={player.id}
                        className={`bg-[${player.backgroundColor}] rounded-lg shadow-xl py-4 px-10 text-2xl text-center text-black focus:bg-opacity-50 focus:text-white focus:outline-none`}
                    >
                        {player.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChoosePlayer;
