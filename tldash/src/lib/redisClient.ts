import { createClient } from 'redis';

let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
//   console.error('Redis Client Error:', err);
console.error('Redis Client Error: ');

let retryAttempts = 0;
let retryDelay = 1000; // Initial delay (milliseconds)

const reconnect = () => {
    if (!redisClient.isOpen && retryAttempts < 5) {  
        retryAttempts++;
        setTimeout(() => {
            console.log(`Retrying Redis connection attempt ${retryAttempts}`);
            redisClient.connect().catch(console.error); // Catch and log errors during reconnect
            retryDelay *= 2; // Exponential backoff for retry attempts
        }, retryDelay);
    } else if (retryAttempts >= 5) {
        console.error('Max retry attempts reached. Redis connection failed.');
        // process.exit(1); // Optionally exit the process if retries are exhausted
    }
};

reconnect();
throw new Error(err.message);


});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();  // Connect if not already connected
      console.log('Connected to Redis');
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Gracefully log the error, without immediate process termination
  }
})();

export default redisClient;
