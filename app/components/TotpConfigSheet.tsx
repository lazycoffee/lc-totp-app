import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { colors } from '../../src/services/theme';
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
  const { isDarkMode } = useThemeContext();
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
      backgroundStyle={[styles.modalBackground, { backgroundColor: isDarkMode ? colors.dark.card : colors.light.card }]}
    >
      <BottomSheetView style={[styles.sheet, { backgroundColor: isDarkMode ? colors.dark.card : colors.light.card }]}>
        <View style={[styles.header, { borderBottomColor: isDarkMode ? colors.dark.border : colors.light.border }]}>
          <Text style={[styles.title, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.title')}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>×</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.preset')}</Text>
          <Picker
            selectedValue={formValues.preset}
            onValueChange={onPresetChange}
            style={[styles.input, { 
              color: isDarkMode ? colors.dark.text : colors.light.text,
              backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
              borderColor: isDarkMode ? colors.dark.border : colors.light.border
            }]}
          >
            <Picker.Item label="Google" value="Google" color={isDarkMode ? colors.dark.text : colors.light.text} />
            <Picker.Item label="Microsoft" value="Microsoft" color={isDarkMode ? colors.dark.text : colors.light.text} />
            <Picker.Item label="GitHub" value="GitHub" color={isDarkMode ? colors.dark.text : colors.light.text} />
            <Picker.Item label={t('totpConfig.preset')} value="Other" color={isDarkMode ? colors.dark.text : colors.light.text} />
          </Picker>

          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.name.label')}</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('totpConfig.name.required'), maxLength: { value: 60, message: t('totpConfig.name.maxLength') } }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder={t('totpConfig.name.placeholder')}
                placeholderTextColor={isDarkMode ? colors.dark.text + '80' : colors.light.text + '80'}
                style={[styles.input, { 
                  color: isDarkMode ? colors.dark.text : colors.light.text,
                  backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
                  borderColor: isDarkMode ? colors.dark.border : colors.light.border
                }]}
                maxLength={60}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.secret.label')}</Text>
          <Controller
            control={control}
            name="secret"
            rules={{ required: t('totpConfig.secret.required') }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder={t('totpConfig.secret.placeholder')}
                placeholderTextColor={isDarkMode ? colors.dark.text + '80' : colors.light.text + '80'}
                style={[styles.input, { 
                  color: isDarkMode ? colors.dark.text : colors.light.text,
                  backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
                  borderColor: isDarkMode ? colors.dark.border : colors.light.border
                }]}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.algorithm')}</Text>
          <Picker
            selectedValue={formValues.algorithm}
            onValueChange={(value) => setValue('algorithm', value)}
            style={[styles.input, { 
              color: isDarkMode ? colors.dark.text : colors.light.text,
              backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
              borderColor: isDarkMode ? colors.dark.border : colors.light.border
            }]}
          >
            <Picker.Item label="SHA-1" value="SHA-1" color={isDarkMode ? colors.dark.text : colors.light.text} />
            <Picker.Item label="SHA-256" value="SHA-256" color={isDarkMode ? colors.dark.text : colors.light.text} />
            <Picker.Item label="SHA-512" value="SHA-512" color={isDarkMode ? colors.dark.text : colors.light.text} />
          </Picker>

          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.digits.label')}</Text>
          <Controller
            control={control}
            name="digits"
            rules={{ required: t('totpConfig.digits.required'), min: { value: 6, message: t('totpConfig.digits.min') }, max: { value: 12, message: t('totpConfig.digits.max') } }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder="6"
                placeholderTextColor={isDarkMode ? colors.dark.text + '80' : colors.light.text + '80'}
                style={[styles.input, { 
                  color: isDarkMode ? colors.dark.text : colors.light.text,
                  backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
                  borderColor: isDarkMode ? colors.dark.border : colors.light.border
                }]}
                keyboardType="numeric"
                onChangeText={(text) => onChange(Number(text))}
                onBlur={onBlur}
                value={value?.toString()}
              />
            )}
          />

          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.period.label')}</Text>
          <Controller
            control={control}
            name="period"
            rules={{ required: t('totpConfig.period.required'), min: { value: 1, message: t('totpConfig.period.min') } }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder="30"
                placeholderTextColor={isDarkMode ? colors.dark.text + '80' : colors.light.text + '80'}
                style={[styles.input, { 
                  color: isDarkMode ? colors.dark.text : colors.light.text,
                  backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
                  borderColor: isDarkMode ? colors.dark.border : colors.light.border
                }]}
                keyboardType="numeric"
                onChangeText={(text) => onChange(Number(text))}
                onBlur={onBlur}
                value={value?.toString()}
              />
            )}
          />
          {control._formState.errors.name && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{control._formState.errors.name.message}</Text>}
          {control._formState.errors.secret && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{control._formState.errors.secret.message}</Text>}
          {control._formState.errors.digits && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{control._formState.errors.digits.message}</Text>}
          {control._formState.errors.period && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{control._formState.errors.period.message}</Text>}
        </View>
        <View style={[styles.footer, { borderTopColor: isDarkMode ? colors.dark.border : colors.light.border }]}>
          <Pressable 
            style={[styles.confirmBtn, { backgroundColor: isDarkMode ? colors.dark.primary : colors.light.primary }]} 
            onPress={handleSubmit(onSave)}
          >
            <Text style={[styles.confirmText, { color: isDarkMode ? colors.dark.card : colors.light.card }]}>{t('totpConfig.confirm')}</Text>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  error: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  confirmBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TotpConfigSheet;

