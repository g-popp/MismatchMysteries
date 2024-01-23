import fs from 'fs';

let questions = {};
let originalQuestions = [];

try {
    const getQuestionsFromFile = fs.readFileSync(
        'utils/questions.json',
        'utf8'
    );
    originalQuestions = JSON.parse(getQuestionsFromFile);
} catch (error) {
    console.log(error);
}

const getRandomQuestion = roomId => {
    // If this room doesn't have its own set of questions yet, create it
    if (!questions[roomId]) {
        questions[roomId] = [...originalQuestions];
    }

    const randomQuestion =
        questions[roomId][Math.floor(Math.random() * questions[roomId].length)];

    // delete selected question from array
    const index = questions[roomId].indexOf(randomQuestion);
    if (index > -1) {
        questions[roomId].splice(index, 1);
    }

    return randomQuestion;
};

const getQuestions = roomId => {
    const normalQuestion = getRandomQuestion(roomId);
    const imposterQuestion = getRandomQuestion(roomId);

    return {
        normalQuestion: normalQuestion,
        imposterQuestion: imposterQuestion
    };
};

export default getQuestions;
