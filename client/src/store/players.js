import { atom } from 'jotai';

export const playerAtom = atom({
    name: undefined,
    id: undefined,
    state: {
        roomId: undefined,
        isHost: false,
        isImposter: false,
        isReady: false,
        hasChosen: false,
        hasBlamed: false,
        choice: undefined,
        blame: undefined
    }
});
