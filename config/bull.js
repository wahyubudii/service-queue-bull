import redis from "redis";
import Queue from "bull";
import { bullQueryKey } from "../common/bullKey.js";

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

export const verifyDocQueue = new Queue(bullQueryKey.document.verify, {
  redis: redisClient,
});

export const sumValueQueue = new Queue(bullQueryKey.sum, {
  redis: redisClient,
});
