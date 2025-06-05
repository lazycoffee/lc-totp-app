import { useState, useEffect } from 'react';
import { View } from 'react-native';
import TotpList from './components/TotpList';
import TotpConfigSheet from './components/TotpConfigSheet';
import { useMMKVStorage } from 'react-native-mmkv';
import { v4 as uuidv4 } from 'uuid';

const HomeScreen = () => {
  const [configs, setConfigs] = useMMKVStorage('totpConfigs', '', 'totpStorage');
  const [isConfigSheetOpen, setIsConfigSheetOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const handleAddConfig = () => {
    setEditingConfig(null);
    setIsConfigSheetOpen(true);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setIsConfigSheetOpen(true);
  };

  const handleSaveConfig = (newConfig) => {
    const updatedConfigs = editingConfig
      ? configs.map(c => c.id === newConfig.id ? newConfig : c)
      : [...configs, { ...newConfig, id: uuidv4() }];
    setConfigs(updatedConfigs);
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
        initialValues={editingConfig}
        onSave={handleSaveConfig}
      />
    </View>
  );
};

export default HomeScreen;
