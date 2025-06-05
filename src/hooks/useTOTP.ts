import { APP_CONSTANTS } from '@constants/index';
import type { TOTPEntry } from '@types/index';
import { authenticator } from 'otplib';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useTOTP = (entry: TOTPEntry) => {
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const generateTOTP = useCallback(() => {
    try {
      const token = authenticator.generate(entry.secret, {
        algorithm: entry.algorithm || APP_CONSTANTS.TOTP_DEFAULTS.algorithm,
        digits: entry.digits || APP_CONSTANTS.TOTP_DEFAULTS.digits,
        period: entry.period || APP_CONSTANTS.TOTP_DEFAULTS.period
      });
      setCode(token);
    } catch (error) {
      console.error('Error generating TOTP:', error);
      setCode('');
    }
  }, [entry]);

  const period = useMemo(
    () => entry.period || APP_CONSTANTS.TOTP_DEFAULTS.period,
    [entry.period]
  );

  useEffect(() => {
    generateTOTP();
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = period - (now % period);
      setTimeLeft(timeLeft);
      if (timeLeft === period) {
        generateTOTP();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generateTOTP, period]);

  return {
    code,
    timeLeft,
    period,
    progress: ((period - timeLeft) / period) * 100
  };
}; 