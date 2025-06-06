import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

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
      backgroundStyle={styles.modalBackground}
    >
      <BottomSheetView style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('totpConfig.title')}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
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
          {control._formState.errors.name && <Text style={styles.error}>{control._formState.errors.name.message}</Text>}
          {control._formState.errors.secret && <Text style={styles.error}>{control._formState.errors.secret.message}</Text>}
          {control._formState.errors.digits && <Text style={styles.error}>{control._formState.errors.digits.message}</Text>}
          {control._formState.errors.period && <Text style={styles.error}>{control._formState.errors.period.message}</Text>}
        </View>
        <View style={styles.footer}>
          <Pressable style={styles.confirmBtn} onPress={handleSubmit(onSave)}>
            <Text style={styles.confirmText}>{t('totpConfig.confirm')}</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'white',
  },
  sheet: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
    marginBottom: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  confirmBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TotpConfigSheet;

