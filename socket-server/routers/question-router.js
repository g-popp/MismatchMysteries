import { Router } from 'express';
import { questionRepository } from '../om/question.js';

export const router = Router();

// --- ROUTES --- //

// PUT New Question
router.put('/', async (req, res) => {
    const question = req.body;
    question.createdAt = new Date();
    question.deletedAt = null;

    await questionRepository.save(question);
    res.json(question);
});

// GET All Questions
router.get('/', async (req, res) => {
    const ids = await questionRepository
        .search()
        .sortBy('createdAt', 'ASC')
        .returnAllIds();

    let questions = await Promise.all(
        ids.map(async id => {
            const question = await questionRepository.fetch(id);
            if (question.deletedAt) return null;
            return {
                id: id,
                text: question.text,
                active: question.active,
                createdAt: question.createdAt
            };
        })
    );

    // Filter out null values (deleted questions)
    questions = questions.filter(question => question !== null);

    res.send(questions);
});

// GET Question by ID
router.get('/:id', async (req, res) => {
    const question = await questionRepository.fetch(req.params.id);
    res.json(question);
});

// POST Update Question
router.post('/:id', async (req, res) => {
    let question = await questionRepository.fetch(req.params.id);

    const ignoredFields = ['createdAt', 'history', 'deletedAt'];

    question.history = [
        ...(question.history || []),
        {
            ...Object.fromEntries(
                Object.entries(question).filter(
                    ([key]) => !ignoredFields.includes(key)
                )
            ),
            updatedAt: new Date()
        }
    ];
    question.text = req.body.text ?? question.text ?? null;
    question.active = req.body.active ?? question.active ?? null;

    question = await questionRepository.save(question);

    res.send(question);
});

// POST Toggle Question
router.post('/:id/toggle', async (req, res) => {
    let question = await questionRepository.fetch(req.params.id);

    question.active = !question.active;

    question = await questionRepository.save(question);

    res.send(question);
});

// Delete All Questions
router.delete('/', async (req, res) => {
    await questionRepository.createIndex();
    const ids = await questionRepository.search().returnAllIds();

    console.log(ids);

    await Promise.all(ids.map(id => questionRepository.remove(id)));
    res.send('All questions deleted');
});

// DELETE Question
router.delete('/:id', async (req, res) => {
    const question = await questionRepository.fetch(req.params.id);
    question.deletedAt = new Date();
    await questionRepository.save(question);

    res.json(question);
});
