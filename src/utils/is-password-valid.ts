import * as bcrypt from 'bcrypt';

/**
 * Validates if a plain text password matches a hashed password
 * @param password - The plain text password to validate
 * @param hashedPassword - The hashed password to compare against
 * @returns A promise that resolves to true if passwords match, false otherwise
 */
export const isPasswordValid = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
