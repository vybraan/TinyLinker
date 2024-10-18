import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Reconnecting attempt #${retries}...`);
      return 700; // 0.7 seconds
    }
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
  redisClient.quit(); 
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

redisClient.on('end', () => {
  console.log('Redis connection closed.');
});

const cleanup = () => {
  console.log('Cleaning up Redis connection...');
  redisClient.quit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

export default redisClient;
