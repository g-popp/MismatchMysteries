const Button = ({ color, handler, children }) => {
    return (
        <button
            onClick={handler}
            style={{ backgroundColor: color }}
            type='button'
            className={
                'w-full text-center text-3xl py-4 px-6 rounded bg-teal-600 hover:bg-teal-700 border-teal-800 border-2 text-white transition bowlby-one'
            }
        >
            {children}
        </button>
    );
};

export default Button;
