import { Router } from 'express';
import { questionRepository } from '../om/question.js';

export const router = Router();

router.put('/', async (req, res) => {
    const question = await questionRepository.save(req.body);
    console.log(question);
    res.json(question);
});

router.get('/', async (req, res) => {
    const questions = await questionRepository.search().return.all();
    res.json(questions);
});

router.get('/:id', async (req, res) => {
    const question = await questionRepository.fetch(req.params.id);
    res.json(question);
});

router.post('/:id', async (req, res) => {
    let question = await questionRepository.fetch(req.params.id);

    question.text = req.body.text ?? null;
    question.active = req.body.active ?? null;

    question = await questionRepository.save(question);

    res.send(question);
});

router.delete('/:id', async (req, res) => {
    const question = await questionRepository.remove(req.params.id);
    res.json(question);
});
