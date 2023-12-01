import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import ShortUniqueId from 'short-unique-id';

const { randomUUID } = new ShortUniqueId({ length: 4 });

export const nameAtom = atomWithStorage('');

export const idAtom = atom(randomUUID());
