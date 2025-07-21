import * as bcrypt from 'bcrypt';

/**
 * Generates a JWT token for a given user ID
 * @param param0 Object containing the user ID to sign
 * @returns Promise that resolves to the signed JWT token string

/**
 * Hashes a password string using bcrypt with a salt factor of 10
 * @param param0 Object containing the plain text password to hash
 * @returns Promise that resolves to the hashed password string
 */
export const hashPassword = async ({ password }: { password: string }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const isPasswordValid = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
