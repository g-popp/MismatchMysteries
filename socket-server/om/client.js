import { createClient } from 'redis';

const url =
    process.env.PORT ||
    'redis://default:dGUn9riZjkUntmT8NYM5JYezNeRuybkc@redis-10602.c55.eu-central-1-1.ec2.redns.redis-cloud.com:10602';

const redis = createClient({ url });
redis.on('error', error => console.log(error));
await redis.connect();

export default redis;
