import { atom } from 'jotai';

export const playerAtom = atom({
    name: undefined,
    id: Math.random().toString(36).substring(2, 15)
});
