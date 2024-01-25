import { Redis } from "ioredis";
import { ENVIRONMENT } from "./environment";

export const RedisClient = new Redis(ENVIRONMENT.CACHE_REDIS?.URL!);
