'use client'
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ButtonHeader from '../ButtonHeader';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../lib/firebase';

// モック関数の作成
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('../../../lib/firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe('ButtonHeader コンポーネント', () => {
  const useRouterMock = useRouter as jest.Mock;
  const useAuthStateMock = useAuthState as jest.Mock;
  const signOutMock = auth.signOut as jest.Mock;

  const mockPush = jest.fn();

  beforeEach(() => {
    useRouterMock.mockReturnValue({ push: mockPush });
    useAuthStateMock.mockReturnValue([null]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('メニューが閉じている状態で「Menu」ボタンが表示される', () => {
    render(<ButtonHeader />);
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  test('「Menu」ボタンをクリックするとメニューが開く', () => {
    render(<ButtonHeader />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByText('記録を見る')).toBeInTheDocument();
  });

  test('メニュー内のリンクをクリックするとメニューが閉じる', () => {
    render(<ButtonHeader />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByText('記録を見る'));
    expect(screen.queryByText('記録を見る')).not.toBeInTheDocument();
  });

  test('「サインアウト」をクリックするとFirebaseでサインアウトが実行され、ログインページにリダイレクトされる', async () => {
    render(<ButtonHeader />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByText('サインアウト'));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});