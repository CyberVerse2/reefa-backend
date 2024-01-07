import { randomBytes } from "crypto";

/**
 * Generates a random string of the specified length.
 * @return {string} - The generated random string.
 */
export const generateRandomString = (): string => {
  return randomBytes(10).toString('hex');
};
