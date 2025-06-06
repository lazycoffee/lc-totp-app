import { HashAlgorithms } from '@otplib/core';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTotp } from '../src/contexts/TotpContext';
import { TotpConfigForm } from '../src/types/totp';
import TotpConfigPage from './components/TotpConfig';

export default function TotpConfigScreen() {
  const { addConfig, updateConfig, configs } = useTotp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const config = id ? configs.find(c => c.id === id) : undefined;

  const getInitialValues = (): Partial<TotpConfigForm> | undefined => {
    if (!config) return undefined;
    const algorithm = config.algorithm === HashAlgorithms.SHA1 ? 'SHA-1' :
                     config.algorithm === HashAlgorithms.SHA256 ? 'SHA-256' :
                     'SHA-512';
    return {
      preset: config.preset,
      name: config.name,
      secret: config.secret,
      algorithm: algorithm as 'SHA-1' | 'SHA-256' | 'SHA-512',
      digits: config.digits,
      period: config.period
    };
  };

  const handleSave = (form: TotpConfigForm) => {
    if (id) {
      updateConfig(id, form);
    } else {
      addConfig(form);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: id ? "Edit TOTP" : "Add TOTP",
          presentation: 'card',
        }}
      />
      <TotpConfigPage onSave={handleSave} initialValues={getInitialValues()} />
    </>
  );
} 