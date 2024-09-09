import { Schema, Repository } from 'redis-om';
import redis from './client.js';

const questionSchema = new Schema('question', {
    text: { type: 'string' },
    active: { type: 'boolean' }
});

export const questionRepository = new Repository(questionSchema, redis);

await questionRepository.createIndex();
