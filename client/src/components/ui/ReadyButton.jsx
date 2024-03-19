const ReadyButton = (isReady, toggleReady) => {
    return (
        <button
            className={`text-black text-center text-lg py-2 px-6 border border-black rounded shadow-sm shadow-black ${
                isReady ? 'bg-teal-600' : 'bg-zinc-500'
            }`}
            onClick={toggleReady}
        >
            Ready
        </button>
    );
};

export default ReadyButton;
