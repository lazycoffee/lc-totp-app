import { generateTOTP as generateTOTPCode, verifyTOTP as verifyTOTPCode } from '../services/totpService';

export const useTOTP = () => {
  const generateTOTP = (secret: string): string => {
    return generateTOTPCode(secret);
  };

  const verifyTOTP = (secret: string, token: string): boolean => {
    return verifyTOTPCode(secret, token);
  };

  return {
    generateTOTP,
    verifyTOTP,
  };
}; 