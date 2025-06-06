import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const handlePress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={handlePress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(<Button title="Test Button" onPress={handlePress} disabled />);
    
    const button = getByTestId('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(button);
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(<Button title="Test Button" onPress={() => {}} loading />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<Button title="Test Button" onPress={() => {}} style={customStyle} />);
    
    const button = getByTestId('button');
    expect(button.props.style.backgroundColor).toBe('red');
  });
}); 