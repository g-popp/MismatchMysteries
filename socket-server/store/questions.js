import getQuestions from '../utils/getQuestions.js';
import { getRoom } from './rooms.js';

const sendQuestions = roomId => {
    try {
        const room = getRoom(roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        const questions = getQuestions(roomId);

        if (!questions || questions.length === 0) {
            throw new Error('No questions found');
        }

        return questions;
    } catch (error) {
        return { error: error.message };
    }
};

export { sendQuestions };
