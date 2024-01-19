import { atom } from 'jotai';

export const questionsAtom = atom(
    [], // initial state
    (get, set, update) => {
        // handle the update asynchronously
        Promise.resolve(update).then(newQuestions => {
            set(questionsAtom, newQuestions);
        });
    }
);
