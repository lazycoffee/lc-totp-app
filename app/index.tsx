import { HashAlgorithms } from '@otplib/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import '../lib/polyfills';
import { useTotp } from '../src/contexts/TotpContext';
import { TotpConfig, TotpConfigForm } from '../src/types/totp';
import TotpList from './components/TotpList';

const HomeScreen = () => {
  const { configs, addConfig, updateConfig, isLoading, error } = useTotp();
  const router = useRouter();
  const [editingConfigId, setEditingConfigId] = useState<string | undefined>(undefined);

  const handleAddConfig = (config?: TotpConfig) => {
    if (config) {
      router.push({
        pathname: '/totp-config',
        params: { id: config.id }
      });
    } else {
      router.push('/totp-config');
    }
  };

  const handleSaveConfig = (newConfig: TotpConfigForm) => {
    if (editingConfigId) {
      updateConfig(editingConfigId, newConfig);
    } else {
      addConfig(newConfig);
    }
    router.back();
  };

  const getInitialValues = (): Partial<TotpConfigForm> | undefined => {
    if (!editingConfigId) return undefined;
    const config = configs.find(c => c.id === editingConfigId);
    if (!config) return undefined;
    return {
      name: config.name,
      serviceProvider: config.serviceProvider,
      secret: config.secret,
      algorithm: config.algorithm === HashAlgorithms.SHA1 ? 'SHA-1' :
                 config.algorithm === HashAlgorithms.SHA256 ? 'SHA-256' :
                 'SHA-512',
      digits: config.digits,
      period: config.period
    };
  };

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <TotpList onAddConfig={handleAddConfig} />
    </View>
  );
};

export default HomeScreen;
