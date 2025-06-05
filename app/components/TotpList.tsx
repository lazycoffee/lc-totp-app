import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, useRef, useEffect } from 'react-native';
import { totp } from 'otplib';
import { ProgressBar } from 'react-native-progress';
import { useTranslation } from 'react-i18next';

interface TotpConfig {
  id: string;
  name: string;
  secret: string;
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512';
  digits: number;
  period: number;
  isRunning?: boolean;
  otpCode?: string;
}

interface TotpListProps {
  configs: TotpConfig[];
  onAddConfig: () => void;
  onEditConfig: (config: TotpConfig) => void;
}

const TotpList = ({ configs, onAddConfig, onEditConfig }: TotpListProps) => {
  const { t } = useTranslation();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (configs.some(c => c.isRunning)) {
      timerRef.current = setInterval(() => {
        setConfigs(prevConfigs => prevConfigs.map(config => {
          if (!config.isRunning) return config;
          const now = Date.now();
          const timeElapsed = now % (config.period * 1000);
          const progress = timeElapsed / (config.period * 1000);
          const otp = totp.generate(config.secret, {
            algorithm: config.algorithm,
            digits: config.digits,
            step: config.period
          });
          return { ...config, otpCode: otp, progress };
        }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [configs]);

  const renderItem = ({ item }: { item: TotpConfig }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => onEditConfig(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.controls}>
        <Pressable
          style={[styles.actionBtn, item.isRunning ? styles.stopBtn : styles.playBtn]}
          onPress={() => {
            setConfigs(prev => prev.map(c => c.id === item.id ? { ...c, isRunning: !c.isRunning } : c));
          }}
        >
          <Text style={styles.actionText}>{item.isRunning ? '■' : '▶'}</Text>
        </Pressable>
        {item.otpCode && <Text style={styles.otpCode}>{item.otpCode}</Text>}
      </View>
      <ProgressBar
        progress={0.5} // 需根据剩余时间动态计算
        width={null}
        height={4}
        style={styles.progress}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={configs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
    paddingBottom: 80 // 为浮动按钮留出空间
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
  }
});