import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { TotpDefaultConfigs } from '../../src/utils/totp_default_config';

export interface TotpConfigForm {
  preset: 'Google' | 'Microsoft' | 'GitHub' | 'Other';
  name: string;
  secret: string;
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512';
  digits: number;
  period: number;
}

interface TotpConfigSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<TotpConfigForm>;
  onSave: (newConfig: TotpConfigForm) => void;
}

const TotpConfigSheet = ({ isOpen, onClose, initialValues, onSave }: TotpConfigSheetProps) => {
  const safeInitialValues = initialValues ?? {};

  // Add bottom sheet configuration
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // Show/hide bottom sheet based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const { control, handleSubmit, reset, watch, setValue } = useForm<TotpConfigForm>({
    defaultValues: {
      preset: 'Other',
      name: '',
      secret: '',
      algorithm: 'SHA-1',
      digits: 6,
      period: 30,
      ...safeInitialValues
    }
  });

  const formValues = watch();

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
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      index={isOpen ? 0 : -1}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>TOTP 配置</Text>
        {/* 预设配置下拉框 */}
        <Picker
          selectedValue={formValues.preset}
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
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder="例如：Github 张三"
              style={styles.input}
              maxLength={60}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        {/* 密钥输入框 */}
        <Controller
          control={control}
          name="secret"
          rules={{ required: '密钥必填' }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder="请输入密钥"
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        {/* 算法下拉框 */}
        <Picker
          selectedValue={formValues.algorithm}
          onValueChange={(value) => setValue('algorithm', value)}
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
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder="6"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => onChange(Number(text))}
              onBlur={onBlur}
              value={value?.toString()}
            />
          )}
        />

        {/* 时间窗口输入框 */}
        <Controller
          control={control}
          name="period"
          rules={{ required: '时间窗口必填', min: { value: 1, message: '最小1秒' } }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder="30"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => onChange(Number(text))}
              onBlur={onBlur}
              value={value?.toString()}
            />
          )}
        />
        {/* 添加表单验证错误提示 */}
        {control._formState.errors.name && <Text style={styles.error}>{control._formState.errors.name.message}</Text>}
        {control._formState.errors.secret && <Text style={styles.error}>{control._formState.errors.secret.message}</Text>}
        {control._formState.errors.digits && <Text style={styles.error}>{control._formState.errors.digits.message}</Text>}
        {control._formState.errors.period && <Text style={styles.error}>{control._formState.errors.period.message}</Text>}
        <Pressable style={styles.confirmBtn} onPress={handleSubmit(onSave)}>
          <Text style={styles.confirmText}>确定</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  confirmBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TotpConfigSheet;

