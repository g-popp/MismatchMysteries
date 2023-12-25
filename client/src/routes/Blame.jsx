import { useAtom } from 'jotai';
import BlamePlayer from '../components/BlamePlayer';
import { allPlayersAtom } from '../store/players';

const Blame = () => {
    const [players] = useAtom(allPlayersAtom);

    return (
        <div className='flex flex-col gap-12 items-center'>
            <h1 className='text-3xl underline'>Blame Phase</h1>
            <h2 className='text-xl text-center'>
                Blame the person you think is the Mismatch
            </h2>
            <BlamePlayer players={players} />
        </div>
    );
};

export default Blame;
