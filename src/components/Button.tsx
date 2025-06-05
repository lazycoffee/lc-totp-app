import { colors, spacing, typography } from '@services/theme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles.disabled : {};

    return [baseStyle, variantStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = styles.text;
    const variantTextStyle = styles[`${variant}Text`];
    const sizeTextStyle = styles[`${size}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};

    return [baseStyle, variantTextStyle, sizeTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.light.primary : colors.light.background}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  primary: {
    backgroundColor: colors.light.primary
  },
  secondary: {
    backgroundColor: colors.light.card
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.light.primary
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center'
  },
  primaryText: {
    color: colors.light.background
  },
  secondaryText: {
    color: colors.light.text
  },
  outlineText: {
    color: colors.light.primary
  },
  smallText: {
    fontSize: typography.fontSize.sm
  },
  mediumText: {
    fontSize: typography.fontSize.md
  },
  largeText: {
    fontSize: typography.fontSize.lg
  },
  disabledText: {
    opacity: 0.5
  }
}); 