import { Router } from 'express';
import { questionRepository } from '../om/question.js';
import { EntityId } from 'redis-om';

export const router = Router();

// --- ROUTES --- //

// PUT New Question
router.put('/', async (req, res) => {
    const question = await questionRepository.save(req.body);
    res.json(question);
});

// GET All Questions
router.get('/', async (req, res) => {
    const ids = await questionRepository.search().returnAllIds();

    const questions = await Promise.all(
        ids.map(async id => {
            const question = await questionRepository.fetch(id);
            return {
                id: id,
                text: question.text,
                active: question.active
            };
        })
    );

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

    question.text = req.body.text ?? null;
    question.active = req.body.active ?? null;

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

// DELETE Question
router.delete('/:id', async (req, res) => {
    const question = await questionRepository.remove(req.params.id);
    res.json(question);
});
