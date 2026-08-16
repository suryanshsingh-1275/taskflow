import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(REDIS_URL);

redisClient.on("connect", () => {
    console.log("Redis connected");
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});


export const pubClient = redisClient.duplicate();
export const subClient = redisClient.duplicate();


export default redisClient;