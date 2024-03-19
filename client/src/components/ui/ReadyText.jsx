/* eslint-disable react/prop-types */
const ReadyText = ({ users }) => {
    const playerCount = users.length;
    const playerReadyCount = users.filter(user => user.state.isReady).length;
    const allPlayersReady = playerCount === playerReadyCount;

    return (
        <h1 className='text-xl'>
            {/* {`${playerReadyCount}/${playerCount} Players are ready`} */}
            <span className={allPlayersReady ? 'text-teal-600' : 'text-white'}>
                {`${playerReadyCount}/${playerCount}`}
            </span>
            <span> Players are ready</span>
        </h1>
    );
};

export default ReadyText;
