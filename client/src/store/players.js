import { atom } from 'jotai';

export const playerAtom = atom({
    name: undefined,
    id: undefined,
    state: {
        roomId: undefined,
        isHost: false,
        isImposter: false,
        hasChosen: false,
        hasBlamed: false,
        choice: undefined,
        blame: undefined
    }
});
