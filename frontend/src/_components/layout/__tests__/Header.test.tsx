'use client'
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserInfo } from '../../../hooks/useUserInfo';
import '@testing-library/jest-dom';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('../../hooks/useUserInfo', () => ({
  useUserInfo: jest.fn(),
}));

jest.mock('../../lib/firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
});

describe('Headerコンポーネント', () => {
  const useRouterMock = useRouter as jest.Mock;
  const useAuthStateMock = useAuthState as jest.Mock;
  const useUserInfoMock = useUserInfo as jest.Mock;

  beforeEach(() => {
    useRouterMock.mockReturnValue({
      push: jest.fn(),
    });
    useAuthStateMock.mockReturnValue([null, false]);
    useUserInfoMock.mockReturnValue({
      userInfo: null,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ログインしていない場合にログインリンクが表示される', () => {
    render(<Header />);
    const loginLink = screen.getByText('ログイン');
    expect(loginLink).toBeInTheDocument();
  });

  test('ログインしていない場合に「アプリの使い方」リンクが表示される', () => {
    render(<Header />);
    const guideLink = screen.getByText('アプリの使い方');
    expect(guideLink).toBeInTheDocument();
  });

  test('ログインしている場合にユーザー情報が表示される', () => {
    useAuthStateMock.mockReturnValue([{ uid: '123' }, false]);
    useUserInfoMock.mockReturnValue({
      userInfo: { message: 'こんにちは、ユーザーさん' },
      loading: false,
    });

    render(<Header />);
    const userInfo = screen.getByText('こんにちは、ユーザーさん');
    expect(userInfo).toBeInTheDocument();
  });

  test('メニューが開閉するかどうかをテスト', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const menu = screen.getByRole('navigation');
    expect(menu).toHaveClass('block');
  });

  test('ログアウトボタンがクリックされたときにログアウトが実行されるかどうかをテスト', async () => {
    useAuthStateMock.mockReturnValue([{ uid: '123' }, false]);
    useUserInfoMock.mockReturnValue({
      userInfo: { message: 'こんにちは、ユーザーさん' },
      loading: false,
    });

    const { auth } = require('../../lib/firebase');
    const signOutMock = auth.signOut as jest.Mock;

    render(<Header />);
    const logoutButton = screen.getByText('ログアウト');
    fireEvent.click(logoutButton);

    expect(signOutMock).toHaveBeenCalled();
  });
});