import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(REDIS_URL);

export const pubClient = redisClient.duplicate();
export const subClient = redisClient.duplicate();

redisClient.on("connect", () => {
    console.log("Redis connected");
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

pubClient.on("connect", () => {
    console.log("Redis pub client connected");
});

pubClient.on("error", (error) => {
    console.error("Redis pub client error:", error.message);
});

subClient.on("connect", () => {
    console.log("Redis sub client connected");
});

subClient.on("error", (error) => {
    console.error("Redis sub client error:", error.message);
});

export default redisClient;
