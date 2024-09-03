import { atom } from 'jotai';
import { init } from '@instantdb/react';

const instantDBAtom = atom(() => {
    const db = init({
        appId: import.meta.env.VITE_INSTANT_DB_APP_ID
    });
    return db;
});

export default instantDBAtom;
