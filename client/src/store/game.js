import { atom } from 'jotai';

export const gameOptionsAtom = atom({
    couchMode: true,
    numberOfImposters: 1
});

export const whoWonAtom = atom(undefined);
