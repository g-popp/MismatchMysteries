import { atom } from 'jotai';

export const playersAtom = atom([
    {
        name: 'Player1',
        backgroundColor: '#E84855',
        id: 1
    },
    {
        name: 'Player2',
        backgroundColor: '#FF9B73',
        id: 2
    },
    {
        name: 'Player3',
        backgroundColor: '#1B998B',
        id: 3
    }
]);
