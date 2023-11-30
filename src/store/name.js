import { atom } from 'jotai';
import ShortUniqueId from 'short-unique-id';

const { randomUUID } = new ShortUniqueId({ length: 4 });

export const nameAtom = atom('');

export const idAtom = atom(randomUUID());
