import { HashAlgorithms } from '@otplib/core';
import { TOTP } from 'otpauth';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTotp } from '../../src/contexts/TotpContext';
import { TotpConfig } from '../../src/types/totp';

interface TotpListProps {
  onAddConfig: () => void;
}

const TotpList = ({ onAddConfig }: TotpListProps) => {
  const { t } = useTranslation();
  const { configs, updateConfig, updateConfigUI } = useTotp();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (configs.some(c => c.isRunning)) {
      timerRef.current = setInterval(() => {
        const updatedConfigs = configs.map(config => {
          if (!config.isRunning) return config;
          const now = Date.now();
          const timeElapsed = now % (config.period * 1000);
          const progress = timeElapsed / (config.period * 1000);
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

  const renderItem = ({ item }: { item: TotpConfig }) => (
    <View style={styles.listItem}>
      <TouchableOpacity 
        style={styles.nameContainer}
        onPress={() => onAddConfig()}
      >
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.controls}>
        <Pressable
          style={[styles.actionBtn, item.isRunning ? styles.stopBtn : styles.playBtn]}
          onPress={() => handlePlayButtonPress(item)}
        >
          <Text style={styles.actionText}>{item.isRunning ? '■' : '▶'}</Text>
        </Pressable>
        {item.otpCode && <Text style={styles.otpCode}>{item.otpCode}</Text>}
      </View>
      <Progress.Bar
        progress={item.progress ?? 0}
        borderWidth={0}
        unfilledColor="rgba(0, 0, 0, 0.1)"
        width={null}
        style={styles.progress}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {configs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('totpList.empty.title')}</Text>
          <Text style={styles.emptySubText}>{t('totpList.empty.subtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={configs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Pressable style={styles.addBtn} onPress={onAddConfig}>
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
    backgroundColor: 'white',
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
    backgroundColor: '#007AFF',
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
    color: '#666',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14,
    color: '#999'
  }
});