import { useState } from 'react';
import { View } from 'react-native';
import { useTotp } from '../src/contexts/TotpContext';
import { TotpConfigForm } from '../src/types/totp';
import TotpConfigSheet from './components/TotpConfigSheet';
import TotpList from './components/TotpList';
import './polyfills';

const HomeScreen = () => {
  const { configs, addConfig, updateConfig, isLoading, error } = useTotp();
  const [isConfigSheetOpen, setIsConfigSheetOpen] = useState(false);
  const [editingConfigId, setEditingConfigId] = useState<string | undefined>(undefined);

  const handleAddConfig = () => {
    setEditingConfigId(undefined);
    setIsConfigSheetOpen(true);
  };

  const handleSaveConfig = (newConfig: TotpConfigForm) => {
    if (editingConfigId) {
      updateConfig(editingConfigId, newConfig);
    } else {
      addConfig(newConfig);
    }
    setIsConfigSheetOpen(false);
  };

  const getInitialValues = () => {
    if (!editingConfigId) return undefined;
    const config = configs.find(c => c.id === editingConfigId);
    if (!config) return undefined;
    return {
      preset: config.preset,
      name: config.name,
      secret: config.secret,
      algorithm: config.algorithm === 'SHA1' ? 'SHA-1' :
                config.algorithm === 'SHA256' ? 'SHA-256' :
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
      <TotpConfigSheet
        isOpen={isConfigSheetOpen}
        onClose={() => setIsConfigSheetOpen(false)}
        initialValues={getInitialValues()}
        onSave={handleSaveConfig}
      />
    </View>
  );
};

export default HomeScreen;
