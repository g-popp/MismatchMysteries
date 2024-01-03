import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const gameIdAtom = atomWithStorage();

export const isGameRunningAtom = atom(false);

export const gameOptionsAtom = atom({
    couchMode: false,
    numberOfImposters: 1
});
