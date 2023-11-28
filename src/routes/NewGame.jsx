import ShortUniqueId from 'short-unique-id';

const NewGame = () => {
    const { randomUUID } = new ShortUniqueId({ length: 8 });

    return (
        <div>
            <h1 className='text-3xl'>New Game:</h1>
            <h2>ID: {randomUUID()}</h2>
        </div>
    );
};

export default NewGame;
