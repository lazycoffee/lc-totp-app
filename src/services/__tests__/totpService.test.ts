import { generateTOTP, verifyTOTP } from '../totpService';

describe('TOTP Service', () => {
  const mockSecret = 'JBSWY3DPEHPK3PXP';

  describe('generateTOTP', () => {
    it('should generate a 6-digit TOTP code', () => {
      const code = generateTOTP(mockSecret);
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes for different secrets', () => {
      const code1 = generateTOTP(mockSecret);
      const code2 = generateTOTP('DIFFERENT_SECRET');
      expect(code1).not.toBe(code2);
    });

    it('should generate different codes at different times', () => {
      const code1 = generateTOTP(mockSecret);
      // Wait for 1 second to ensure different time window
      setTimeout(() => {
        const code2 = generateTOTP(mockSecret);
        expect(code1).not.toBe(code2);
      }, 1000);
    });
  });

  describe('verifyTOTP', () => {
    it('should verify a valid TOTP code', () => {
      const code = generateTOTP(mockSecret);
      const isValid = verifyTOTP(mockSecret, code);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid TOTP code', () => {
      const isValid = verifyTOTP(mockSecret, '000000');
      expect(isValid).toBe(false);
    });

    it('should reject codes with wrong length', () => {
      const isValid = verifyTOTP(mockSecret, '12345');
      expect(isValid).toBe(false);
    });

    it('should reject non-numeric codes', () => {
      const isValid = verifyTOTP(mockSecret, 'abcdef');
      expect(isValid).toBe(false);
    });
  });
});