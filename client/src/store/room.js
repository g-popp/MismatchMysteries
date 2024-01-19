import { atom } from 'jotai';

export const roomAtom = atom({
    id: undefined,
    users: [],
    round: 0,
    isGameRunning: false
});
