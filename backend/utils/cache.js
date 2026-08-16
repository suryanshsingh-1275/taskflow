import redisClient from "../config/redis.js";


export const getCache = async (key) => {

    try {

        const cached = await redisClient.get(key);

        if (!cached) {
            return null;
        }

        return JSON.parse(cached);

    } catch (error) {

        console.error("Cache Get Error:", error);

        return null;

    }

};


export const setCache = async (key, value, ttlSeconds = 60) => {

    try {

        await redisClient.set(
            key,
            JSON.stringify(value),
            "EX",
            ttlSeconds
        );

    } catch (error) {

        console.error("Cache Set Error:", error);

    }

};


export const delCache = async (key) => {

    try {

        await redisClient.del(key);

    } catch (error) {

        console.error("Cache Delete Error:", error);

    }

};