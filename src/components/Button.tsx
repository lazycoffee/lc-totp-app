import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../services/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;
    
    return (
        <TouchableOpacity
            style={[
                styles.button,
                isDisabled && styles.buttonDisabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            testID="button"
        >
            {loading ? (
                <ActivityIndicator testID="loading-indicator" color={colors.light.background} />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: colors.light.border,
        opacity: 0.7,
    },
    text: {
        color: colors.light.background,
        fontSize: typography.fontSize.md,
        fontWeight: '600',
    },
}); 