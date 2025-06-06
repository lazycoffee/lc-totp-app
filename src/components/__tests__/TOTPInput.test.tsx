import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { verifyTOTP } from '../../services/totpService';
import TOTPInput from '../TOTPInput';

jest.mock('../../services/totpService');

describe('TOTPInput Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TOTP input field', () => {
    const { getByTestId } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    expect(getByTestId('totp-input')).toBeTruthy();
  });

  it('accepts only numeric input', () => {
    const { getByTestId } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    fireEvent.changeText(input, 'abc');
    expect(input.props.value).toBe('');
  });

  it('limits input to 6 digits', () => {
    const { getByTestId } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    fireEvent.changeText(input, '1234567');
    expect(input.props.value).toBe('123456');
  });

  it('calls onSuccess when valid TOTP is entered', () => {
    (verifyTOTP as jest.Mock).mockReturnValue(true);
    
    const { getByTestId } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    fireEvent.changeText(input, '123456');
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('calls onError when invalid TOTP is entered', () => {
    (verifyTOTP as jest.Mock).mockReturnValue(false);
    
    const { getByTestId } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    fireEvent.changeText(input, '000000');
    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('shows error message when invalid code is entered', () => {
    (verifyTOTP as jest.Mock).mockReturnValue(false);
    
    const { getByTestId, getByText } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    fireEvent.changeText(input, '000000');
    expect(getByText('Invalid code')).toBeTruthy();
  });

  it('clears error message when new input is entered', async () => {
    (verifyTOTP as jest.Mock).mockReturnValue(false);
    
    const { getByTestId, getByText, queryByText } = render(<TOTPInput onSuccess={mockOnSuccess} onError={mockOnError} />);
    const input = getByTestId('totp-input');
    
    // Enter invalid code
    fireEvent.changeText(input, '000000');
    expect(getByText('Invalid code')).toBeTruthy();
    
    // Now mock verifyTOTP to return true for the new code
    (verifyTOTP as jest.Mock).mockReturnValue(true);
    // Enter new code
    fireEvent.changeText(input, '123456');
    await waitFor(() => {
      expect(queryByText('Invalid code')).toBeNull();
    });
  });
}); 