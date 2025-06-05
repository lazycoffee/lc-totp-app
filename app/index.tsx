import { HashAlgorithms } from '@otplib/core';
import { useState } from 'react';
import { View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { v4 as uuidv4 } from 'uuid';
import TotpConfigSheet, { TotpConfigForm } from './components/TotpConfigSheet';
import TotpList, { TotpConfig } from './components/TotpList';

const storage = new MMKV({ id: 'totpStorage' });

// Convert TotpConfigForm to TotpConfig
function formToConfig(form: TotpConfigForm, id: string): TotpConfig {
  return {
    ...form,
    id,
    algorithm:
      form.algorithm === 'SHA-1' ? HashAlgorithms.SHA1 :
      form.algorithm === 'SHA-256' ? HashAlgorithms.SHA256 :
      HashAlgorithms.SHA512
  };
}

// Convert TotpConfig to TotpConfigForm
function configToForm(config: TotpConfig): TotpConfigForm {
  return {
    preset: 'Other', // or map if you have preset info
    name: config.name,
    secret: config.secret,
    algorithm:
      config.algorithm === HashAlgorithms.SHA1 ? 'SHA-1' :
      config.algorithm === HashAlgorithms.SHA256 ? 'SHA-256' :
      'SHA-512',
    digits: config.digits,
    period: config.period
  };
}

const HomeScreen = () => {
  const [configs, setConfigs] = useState<TotpConfig[]>(() => {
    const stored = storage.getString('totpConfigs');
    return stored ? JSON.parse(stored) : [];
  });
  const [isConfigSheetOpen, setIsConfigSheetOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TotpConfig | undefined>(undefined);

  const handleAddConfig = () => {
    setEditingConfig(undefined);
    setIsConfigSheetOpen(true);
  };

  const handleEditConfig = (configs: TotpConfig[]) => {
    if (configs.length === 1) {
      setEditingConfig(configs[0]);
      setIsConfigSheetOpen(true);
    } else {
      setConfigs(configs);
    }
  };

  const handleSaveConfig = (newConfig: TotpConfigForm) => {
    const updatedConfigs = editingConfig
      ? configs.map((c: TotpConfig) => c.id === editingConfig.id ? formToConfig(newConfig, c.id) : c)
      : [...configs, formToConfig(newConfig, uuidv4())];
    setConfigs(updatedConfigs);
    storage.set('totpConfigs', JSON.stringify(updatedConfigs));
    setIsConfigSheetOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TotpList
        configs={configs}
        onAddConfig={handleAddConfig}
        onEditConfig={handleEditConfig}
      />
      <TotpConfigSheet
        isOpen={isConfigSheetOpen}
        onClose={() => setIsConfigSheetOpen(false)}
        initialValues={editingConfig ? configToForm(editingConfig) : undefined}
        onSave={handleSaveConfig}
      />
    </View>
  );
};

export default HomeScreen;
