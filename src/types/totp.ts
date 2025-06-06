import { HashAlgorithms } from '@otplib/core';

export type TotpPreset = 'Google' | 'Microsoft' | 'GitHub' | 'Other';

export interface TotpConfigForm {
  preset: TotpPreset;
  name: string;
  secret: string;
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512';
  digits: number;
  period: number;
}

export interface TotpConfig extends Omit<TotpConfigForm, 'algorithm'> {
  id: string;
  algorithm: HashAlgorithms;
  isRunning?: boolean;
  otpCode?: string;
  progress?: number;
}

export interface TotpContextType {
  configs: TotpConfig[];
  addConfig: (config: TotpConfigForm) => void;
  updateConfig: (id: string, config: TotpConfigForm) => void;
  deleteConfig: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  updateConfigUI: (id: string, partial: Partial<TotpConfig>) => void;
} 

