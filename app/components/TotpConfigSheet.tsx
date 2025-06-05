import { View, Text, TextInput, StyleSheet, Pressable, Picker } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { TotpDefaultConfigs } from '../../src/utils/totp_default_config';

interface TotpConfigForm {
  preset: 'Google' | 'Microsoft' | 'GitHub' | 'Other';
  name: string;
  secret: string;
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512';
  digits: number;
  period: number;
}

const TotpConfigSheet = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control, handleSubmit, reset } = useForm<TotpConfigForm>({
    defaultValues: {
      preset: 'Other',
      name: '',
      secret: '',
      algorithm: 'SHA-1',
      digits: 6,
      period: 30
    }
  });

  const onPresetChange = (preset: TotpConfigForm['preset']) => {
    if (preset !== 'Other' && TotpDefaultConfigs[preset]) {
      reset({
        ...TotpDefaultConfigs[preset] as any,
        preset,
        name: '',
        secret: ''
      });
    }
  };

  return (
    <BottomSheetView isOpen={isOpen} onClose={onClose} style={styles.sheet}>
      <Text style={styles.title}>TOTP 配置</Text>
      {/* 预设配置下拉框 */}
      <Picker
        selectedValue={control.formState.values.preset}
        onValueChange={onPresetChange}
        style={styles.input}
      >
        <Picker.Item label="Google" value="Google" />
        <Picker.Item label="Microsoft" value="Microsoft" />
        <Picker.Item label="GitHub" value="GitHub" />
        <Picker.Item label="其他" value="Other" />
      </Picker>

      {/* 配置名称输入框 */}
      <Controller
        control={control}
        name="name"
        rules={{ required: '配置名称必填', maxLength: { value: 60, message: '最多60个字符' } }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="例如：Github 张三"
            style={styles.input}
            maxLength={60}
          />
        )}
      />

      {/* 密钥输入框 */}
      <Controller
        control={control}
        name="secret"
        rules={{ required: '密钥必填' }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="请输入密钥"
            style={styles.input}
          />
        )}
      />

      {/* 算法下拉框 */}
      <Picker
        selectedValue={control.formState.values.algorithm}
        onValueChange={(value) => control.setValue('algorithm', value)}
        style={styles.input}
      >
        <Picker.Item label="SHA-1" value="SHA-1" />
        <Picker.Item label="SHA-256" value="SHA-256" />
        <Picker.Item label="SHA-512" value="SHA-512" />
      </Picker>

      {/* OPT位数输入框 */}
      <Controller
        control={control}
        name="digits"
        rules={{ required: '位数必填', min: { value: 6, message: '最小6位' }, max: { value: 12, message: '最大12位' } }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="6"
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />

      {/* 时间窗口输入框 */}
      <Controller
        control={control}
        name="period"
        rules={{ required: '时间窗口必填', min: { value: 1, message: '最小1秒' } }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="30"
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      {/* 添加表单验证错误提示 */}
      {control.formState.errors.name && <Text style={styles.error}>{control.formState.errors.name.message}</Text>}
      {control.formState.errors.secret && <Text style={styles.error}>{control.formState.errors.secret.message}</Text>}
      {control.formState.errors.digits && <Text style={styles.error}>{control.formState.errors.digits.message}</Text>}
      {control.formState.errors.period && <Text style={styles.error}>{control.formState.errors.period.message}</Text>}
      <Pressable style={styles.confirmBtn} onPress={handleSubmit(() => {})}>
        <Text style={styles.confirmText}>确定</Text>
      </Pressable>
    </BottomSheetView>
  );
};

export default TotpConfigSheet;

const styles = StyleSheet.create({
  sheet: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  confirmBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center'
  },
  confirmText: {
    color: 'white',
    fontSize: 16
  }
});