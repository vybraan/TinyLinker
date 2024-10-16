import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
  // console.error('Redis Client Error:', err);
  console.error('Redis Client Error: ');
  throw Error(err.message);


});

redisClient.on('connect', () => {
  console.log('Connecting to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis is ready for commands.');
});

redisClient.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

export default redisClient;
