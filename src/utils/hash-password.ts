import * as bcrypt from 'bcrypt';

/**
 * Hashes a password string using bcrypt with a salt factor of 10
 * @param {Object} params - The parameters object
 * @param {string} params.password - The plain text password to hash
 * @returns {Promise<string>} Promise that resolves to the hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
