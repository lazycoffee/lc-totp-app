import { colors, spacing } from '@services/theme';
import React from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle
} from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  ...props
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: colors.light.text,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  }
}); 