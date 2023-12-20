const Button = ({ color, handler, children }) => {
    return (
        <button
            onClick={handler}
            className={`bg-[#${color}] text-black text-center text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black`}
        >
            {children}
        </button>
    );
};

export default Button;
