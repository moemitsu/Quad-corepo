import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: { uid: 'test-uid' },
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginForm and submits login form', async () => {
    render(<LoginForm />);

    // Input email and password
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password' },
    });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // Verify that the login function was called with correct arguments
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  test('redirects to family-registration on user not found', async () => {
    mockLogin.mockRejectedValueOnce({ code: 'auth/user-not-found', message: 'ユーザーが見つかりません' });

    render(<LoginForm />);

    // Input email and password
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'nonexistent@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password' },
    });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText('ユーザーが見つかりません');
      expect(errorMessage).toBeInTheDocument();
    });

    // Verify that the router push was called with correct path
    expect(mockPush).toHaveBeenCalledWith('/family-registration');
  });

  test('displays error message on wrong password', async () => {
    mockLogin.mockRejectedValueOnce({ code: 'auth/wrong-password', message: 'パスワードが違います' });

    render(<LoginForm />);

    // Input email and password
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'wrongpassword' },
    });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText('パスワードが違います');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
