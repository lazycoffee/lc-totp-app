import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { useTotp } from '../../src/contexts/TotpContext';
import { colors } from '../../src/services/theme';
import { TotpConfigForm as TotpConfigFormType } from '../../src/types/totp';

export interface TotpConfigForm extends TotpConfigFormType {}

interface TotpConfigPageProps {
  initialValues?: Partial<TotpConfigForm>;
  onSave: (newConfig: TotpConfigForm) => void;
  configId?: string;
}

const TotpConfigPage = ({ initialValues, onSave, configId }: TotpConfigPageProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeContext();
  const { deleteConfig } = useTotp();
  const router = useRouter();
  const safeInitialValues = initialValues ?? {};

  const [showAdvanced, setShowAdvanced] = useState(false);
  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<TotpConfigForm>({
    defaultValues: {
      name: '',
      serviceProvider: '',
      secret: '',
      algorithm: 'SHA-1',
      digits: 6,
      period: 30,
      ...safeInitialValues
    },
    mode: 'onChange'
  });

  const formValues = watch();

  const onSubmit = (data: TotpConfigForm) => {
    if (isValid) {
      onSave(data);
      router.back();
    }
  };

  const handleDelete = () => {
    if (!configId) return;
    
    const confirmed = window.confirm(
      t('totpList.delete.message')
    );
    
    if (confirmed) {
      try {
        deleteConfig(configId);
        router.back();
      } catch (error) {
        console.error('Error deleting TOTP:', error);
        window.alert(t('totpList.delete.error'));
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.card : colors.light.card }]}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? colors.dark.border : colors.light.border }]}>
        <Text style={[styles.title, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.title')}</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.name.label')}</Text>
          <Controller
            control={control}
            name="name"
            rules={{ 
              required: t('totpConfig.name.required'), 
              maxLength: { value: 60, message: t('totpConfig.name.maxLength') },
              validate: value => value.trim().length > 0 || t('totpConfig.name.required')
            }}
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
            rules={{ 
              required: t('totpConfig.secret.required'),
              validate: value => value.trim().length > 0 || t('totpConfig.secret.required')
            }}
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

          {showAdvanced && (
            <>
              <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.algorithm')}</Text>
              <Controller
                control={control}
                name="algorithm"
                rules={{ required: t('totpConfig.algorithm.required') }}
                render={({ field: { value, onChange } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={[styles.pickerInput, { 
                      color: isDarkMode ? colors.dark.text : colors.light.text,
                      backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
                      borderColor: isDarkMode ? colors.dark.border : colors.light.border
                    }]}
                  >
                    <Picker.Item label="SHA-1" value="SHA-1" color={isDarkMode ? colors.dark.text : colors.light.text} />
                    <Picker.Item label="SHA-256" value="SHA-256" color={isDarkMode ? colors.dark.text : colors.light.text} />
                    <Picker.Item label="SHA-512" value="SHA-512" color={isDarkMode ? colors.dark.text : colors.light.text} />
                  </Picker>
                )}
              />

              <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.digits.label')}</Text>
              <Controller
                control={control}
                name="digits"
                rules={{ 
                  required: t('totpConfig.digits.required'), 
                  min: { value: 6, message: t('totpConfig.digits.min') }, 
                  max: { value: 12, message: t('totpConfig.digits.max') },
                  validate: value => !isNaN(value) && value >= 6 && value <= 12 || t('totpConfig.digits.invalid')
                }}
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
                    onChangeText={(text) => {
                      const num = Number(text);
                      if (!isNaN(num)) {
                        onChange(num);
                      }
                    }}
                    onBlur={onBlur}
                    value={value?.toString()}
                  />
                )}
              />

              <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>{t('totpConfig.period.label')}</Text>
              <Controller
                control={control}
                name="period"
                rules={{ 
                  required: t('totpConfig.period.required'), 
                  min: { value: 1, message: t('totpConfig.period.min') },
                  validate: value => !isNaN(value) && value >= 1 || t('totpConfig.period.invalid')
                }}
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
                    onChangeText={(text) => {
                      const num = Number(text);
                      if (!isNaN(num)) {
                        onChange(num);
                      }
                    }}
                    onBlur={onBlur}
                    value={value?.toString()}
                  />
                )}
              />
            </>
          )}
          {errors.name && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{errors.name.message}</Text>}
          {errors.secret && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{errors.secret.message}</Text>}
          {errors.digits && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{errors.digits.message}</Text>}
          {errors.period && <Text style={[styles.error, { color: isDarkMode ? colors.dark.error : colors.light.error }]}>{errors.period.message}</Text>}
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: isDarkMode ? colors.dark.border : colors.light.border }]}>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.moreBtn, { 
              backgroundColor: isDarkMode ? colors.dark.card : colors.light.card,
              borderColor: isDarkMode ? colors.dark.border : colors.light.border
            }]} 
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={[styles.moreText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
              {t('totpConfig.more')}
            </Text>
          </Pressable>
          <Pressable 
            style={[
              styles.confirmBtn, 
              { 
                backgroundColor: isDarkMode ? colors.dark.primary : colors.light.primary,
                opacity: isValid ? 1 : 0.5
              }
            ]} 
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            <Text style={[styles.confirmText, { color: isDarkMode ? colors.dark.card : colors.light.card }]}>{t('totpConfig.confirm')}</Text>
          </Pressable>
        </View>
        {configId && (
          <Pressable 
            style={[styles.deleteBtn, { 
              backgroundColor: isDarkMode ? colors.dark.error + 'CC' : colors.light.error + 'CC',
              marginTop: 12
            }]} 
            onPress={handleDelete}
            testID="delete-totp-button"
          >
            <Text style={[styles.deleteText, { color: isDarkMode ? colors.dark.card : colors.light.card }]}>{t('totpConfig.delete')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  moreBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  moreText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pickerInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TotpConfigPage; 