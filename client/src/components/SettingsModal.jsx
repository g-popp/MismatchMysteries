const SettingsModal = () => {
    return(
            <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10'>
                <div className='bg-black p-20 border rounded-lg flex flex-col justify-between h-1/2'>
                    <div>
                        <h2 className='text-2xl mb-4'>Options</h2>
                        <label className='flex items-center space-x-6'>
                            <input
                                type='checkbox'
                                checked={couchMode}
                                onChange={setCouchMode}
                                /*setGameOptions(prevOptions => ({ ...prevOptions, couchMode: !prevOptions.couchMode}))*/
                                className='h-6 w-6'
                            />
                            <span className='text-lg'>Online Mode</span>
                        </label>
                    </div>
                    <div className='mt-4'>
                        <label className='block'>
                            Number of Imposters:
                            <select
                                value={numberOfImposters}
                                onChange={handleNumberOfImpostersChange}
                                className='w-full p-1 border rounded-md'
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                        </label>
                    </div>
                    <Button
                        handler={() => setShowOptions(false)}
                        color='#E84855'
                        className='mt-4'
                    >
                        Close
                    </Button>
                </div>
            </div>
    )
}

export default SettingsModal;