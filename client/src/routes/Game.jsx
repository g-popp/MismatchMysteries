import ChoosePlayer from '../components/ChoosePlayer';
import QuestionCard from '../components/QuestionCard';

const Game = () => {
    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game</h1>
            <QuestionCard />
            <ChoosePlayer />
        </div>
    );
};

export default Game;
