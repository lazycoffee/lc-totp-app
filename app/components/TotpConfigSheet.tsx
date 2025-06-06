import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <Text style={styles.title}>{t('totpConfig.title')}</Text>
        {/* 预设配置下拉框 */}
        <Text style={styles.label}>{t('totpConfig.preset')}</Text>
        <Picker
          selectedValue={formValues.preset}
          onValueChange={onPresetChange}
          style={styles.input}
        >
          <Picker.Item label="Google" value="Google" />
          <Picker.Item label="Microsoft" value="Microsoft" />
          <Picker.Item label="GitHub" value="GitHub" />
          <Picker.Item label={t('totpConfig.preset')} value="Other" />
        </Picker>

        {/* 配置名称输入框 */}
        <Text style={styles.label}>{t('totpConfig.name.label')}</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: t('totpConfig.name.required'), maxLength: { value: 60, message: t('totpConfig.name.maxLength') } }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder={t('totpConfig.name.placeholder')}
              style={styles.input}
              maxLength={60}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        {/* 密钥输入框 */}
        <Text style={styles.label}>{t('totpConfig.secret.label')}</Text>
        <Controller
          control={control}
          name="secret"
          rules={{ required: t('totpConfig.secret.required') }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder={t('totpConfig.secret.placeholder')}
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        {/* 算法下拉框 */}
        <Text style={styles.label}>{t('totpConfig.algorithm')}</Text>
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
        <Text style={styles.label}>{t('totpConfig.digits.label')}</Text>
        <Controller
          control={control}
          name="digits"
          rules={{ required: t('totpConfig.digits.required'), min: { value: 6, message: t('totpConfig.digits.min') }, max: { value: 12, message: t('totpConfig.digits.max') } }}
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
        <Text style={styles.label}>{t('totpConfig.period.label')}</Text>
        <Controller
          control={control}
          name="period"
          rules={{ required: t('totpConfig.period.required'), min: { value: 1, message: t('totpConfig.period.min') } }}
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
          <Text style={styles.confirmText}>{t('totpConfig.confirm')}</Text>
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
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

