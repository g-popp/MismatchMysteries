import fs from 'fs';

let questions = [];

try {
    const getQuestionsFromFile = fs.readFileSync('./questions.json', 'utf-8');
    questions = JSON.parse(getQuestionsFromFile);
} catch (error) {
    console.log(error);
}

const getRandomQuestion = () => {
    const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];

    // delete selected question from array
    const index = questions.indexOf(randomQuestion);
    if (index > -1) {
        questions.splice(index, 1);
    }

    return randomQuestion;
};

const getQuestions = () => {
    const normalQuestion = getRandomQuestion();
    const imposterQuestion = getRandomQuestion();

    return [normalQuestion, imposterQuestion];
};

export default getQuestions;
