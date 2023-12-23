import { useState } from 'react';

const useRandomColor = () => {
    const colors = ['#FF9B71', '#1B998B', '#FFFD82', '#E84855'];

    const [color] = useState(Math.floor(Math.random() * colors.length));

    return [color];
};

export default useRandomColor;
