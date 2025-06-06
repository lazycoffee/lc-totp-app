import { authenticator } from 'otplib';

/**
 * Generates a TOTP code for the given secret
 * @param secret The secret key to generate the TOTP code
 * @returns A 6-digit TOTP code
 */
export const generateTOTP = (secret: string): string => {
  return authenticator.generate(secret);
};

/**
 * Verifies if a TOTP code is valid for the given secret
 * @param secret The secret key to verify against
 * @param token The TOTP code to verify
 * @returns True if the code is valid, false otherwise
 */
export const verifyTOTP = (secret: string, token: string): boolean => {
  // Validate token format
  if (!/^\d{6}$/.test(token)) {
    return false;
  }

  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    return false;
  }
}; 