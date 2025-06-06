import { HashAlgorithms } from '@otplib/core';
import { TOTP } from 'otpauth';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { useTotp } from '../../src/contexts/TotpContext';
import { colors } from '../../src/services/theme';
import { TotpConfig } from '../../src/types/totp';

interface TotpListProps {
  onAddConfig: (config?: TotpConfig) => void;
}

const TotpList = ({ onAddConfig }: TotpListProps) => {
  const { t } = useTranslation();
  const { configs, updateConfig, updateConfigUI, deleteConfig } = useTotp();
  const { isDarkMode } = useThemeContext();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (configs.some(c => c.isRunning)) {
      timerRef.current = setInterval(() => {
        const updatedConfigs = configs.map(config => {
          if (!config.isRunning) return config;
          const now = Date.now();
          const timeElapsed = now % (config.period * 1000);
          const progress = 1 - (timeElapsed / (config.period * 1000));
          try {
            const totp = new TOTP({
              algorithm: config.algorithm === HashAlgorithms.SHA1 ? 'SHA1' :
                        config.algorithm === HashAlgorithms.SHA256 ? 'SHA256' :
                        'SHA512',
              digits: config.digits,
              period: config.period,
              secret: config.secret
            });
            const otp = totp.generate();
            return { ...config, otpCode: otp, progress };
          } catch (error) {
            console.error('Error generating TOTP:', error);
            return config;
          }
        });
        updatedConfigs.forEach(config => {
          if (updateConfigUI) {
            updateConfigUI(config.id, {
              otpCode: config.otpCode,
              progress: config.progress
            });
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [configs, updateConfig, updateConfigUI]);

  const handlePlayButtonPress = (item: TotpConfig) => {
    if (updateConfigUI) {
      updateConfigUI(item.id, { isRunning: !item.isRunning });
    }
  };

  const handleDeletePress = (item: TotpConfig) => {
    const confirmed = window.confirm(
      t('totpList.delete.message')
    );
    
    if (confirmed) {
      try {
        deleteConfig(item.id);
      } catch (error) {
        console.error('Error deleting TOTP:', error);
        window.alert(t('totpList.delete.error'));
      }
    }
  };

  const renderItem = ({ item }: { item: TotpConfig }) => (
    <View style={[styles.listItem, { backgroundColor: isDarkMode ? colors.dark.card : colors.light.card }]}>
      <TouchableOpacity 
        style={styles.nameContainer}
        onPress={() => onAddConfig(item)}
      >
        <Text style={[styles.name, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.controls}>
        {item.otpCode && <Text style={[styles.otpCode, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{item.otpCode}</Text>}
        <Pressable
          style={[styles.actionBtn, item.isRunning ? styles.stopBtn : styles.playBtn]}
          onPress={() => handlePlayButtonPress(item)}
        >
          <Text style={styles.actionText}>{item.isRunning ? '■' : '▶'}</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDeletePress(item)}
          testID="delete-totp-button"
        >
          <Text style={styles.actionText}>×</Text>
        </Pressable>
      </View>
      <Progress.Bar
        progress={item.progress ?? 0}
        borderWidth={0}
        unfilledColor={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
        color={isDarkMode ? colors.dark.primary : colors.light.primary}
        width={null}
        style={styles.progress}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.background : colors.light.background }]}>
      {configs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpList.empty.title')}</Text>
          <Text style={[styles.emptySubText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpList.empty.subtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={configs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Pressable 
        style={[styles.addBtn, { backgroundColor: isDarkMode ? colors.dark.primary : colors.light.primary }]} 
        onPress={() => onAddConfig()}
      >
        <Text style={styles.addBtnText}>+</Text>
      </Pressable>
    </View>
  );
};

export default TotpList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  listContent: {
    paddingBottom: 80
  },
  listItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    flex: 1,
    fontSize: 16
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playBtn: {
    backgroundColor: '#007AFF'
  },
  stopBtn: {
    backgroundColor: '#FF3B30'
  },
  actionText: {
    color: 'white',
    fontSize: 14
  },
  otpCode: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  addBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  addBtnText: {
    color: 'white',
    fontSize: 28
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14
  },
  deleteBtn: {
    backgroundColor: '#FF3B30'
  }
});