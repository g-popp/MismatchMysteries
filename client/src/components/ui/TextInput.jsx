/* eslint-disable react/prop-types */
const TextInput = ({ placeholder, value, setValue, displayName }) => {
    return (
        <div className='relative h-12 w-full min-w-[200px]'>
            <input
                placeholder={placeholder}
                type='text'
                className='form-textbox peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 text-lg font-normal text-black outline outline-0 transition-all placeholder-shown:border-black focus:border-[#1B998B] focus:outline-0 disabled:border-0 disabled:bg-black'
                onChange={setValue}
                value={value}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-lg font-normal leading-tight text-black transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-[#1B998B] after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-black peer-focus:text-sm peer-focus:leading-tight peer-focus:text-[#1B998B] peer-focus:after:scale-x-100 peer-focus:after:border-[#1B998B] peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-black">
                {displayName}
            </label>
        </div>
    );
};

export default TextInput;
