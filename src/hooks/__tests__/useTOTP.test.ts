import { act, renderHook } from '@testing-library/react';
import * as totpService from '../../services/totpService';
import { useTOTP } from '../useTOTP';

// Mock the TOTP service
jest.mock('../../services/totpService');

describe('useTOTP Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a TOTP code', () => {
    const mockCode = '123456';
    (totpService.generateTOTP as jest.Mock).mockReturnValue(mockCode);

    const { result } = renderHook(() => useTOTP());
    
    act(() => {
      const code = result.current.generateTOTP('test-secret');
      expect(code).toBe(mockCode);
    });
  });

  it('should verify a valid TOTP code', () => {
    (totpService.verifyTOTP as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useTOTP());
    
    act(() => {
      const isValid = result.current.verifyTOTP('test-secret', '123456');
      expect(isValid).toBe(true);
    });
  });

  it('should reject an invalid TOTP code', () => {
    (totpService.verifyTOTP as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useTOTP());
    
    act(() => {
      const isValid = result.current.verifyTOTP('test-secret', '000000');
      expect(isValid).toBe(false);
    });
  });

  it('should handle errors gracefully', () => {
    (totpService.generateTOTP as jest.Mock).mockImplementation(() => {
      throw new Error('TOTP generation failed');
    });

    const { result } = renderHook(() => useTOTP());
    
    act(() => {
      expect(() => {
        result.current.generateTOTP('test-secret');
      }).toThrow('TOTP generation failed');
    });
  });
});