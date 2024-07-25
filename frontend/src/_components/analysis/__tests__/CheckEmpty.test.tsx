// src/_components/analysis/__tests__/CheckEmpty.test.tsx
'use client'
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CheckEmpty from '../CheckEmpty';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';

// firebase認証とaxiosをモック
jest.mock('react-firebase-hooks/auth');
jest.mock('axios');

// 認証状態とAPI呼び出しのレスポンスを呼び出し
describe('CheckEmpty', () => {
  const mockUseAuthState = useAuthState as jest.Mock;
  const mockAxiosGet = axios.get as jest.Mock;

  beforeEach(() => {
    mockUseAuthState.mockReturnValue([null, true, null]); // デフォルトはローディング中
    mockAxiosGet.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
// データが提供されていない場合に'データを読み込んでいます...'メッセージが表示されることを確認
  test('renders loading message', () => {
    render(<CheckEmpty isEmpty={true} />);
    expect(screen.getByText('データを読み込んでいます...')).toBeInTheDocument();
  });
// ユーザーのデータがなかった場合に、下記のメッセージが表示される確認
  test('renders empty data message when isEmpty is true', () => {
    mockUseAuthState.mockReturnValue([{ uid: '123' }, false, null]); // ログインユーザーをモック
    render(<CheckEmpty isEmpty={true} />);
    expect(screen.getByText('データがまだありません。記録を追加するボタンから2つ以上記録を追加してください。')).toBeInTheDocument();
  });
// ユーザーのデータがからではない場合
  test('renders non-empty data message when isEmpty is false', () => {
    mockUseAuthState.mockReturnValue([{ uid: '123' }, false, null]); // ログインユーザーをモック
    render(<CheckEmpty isEmpty={false} />);
    expect(screen.getByText('データが読み込まれています...')).toBeInTheDocument();
  });
// データが提供された場合
  test('fetches data and sets data state', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]); // ログインユーザーをモック
    mockAxiosGet.mockResolvedValue({ data: [{ id: 1, name: 'Test Data' }] });

    render(<CheckEmpty isEmpty={false} />);
// 非同期処理の完了を待つ
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    // Axiosのリクエストが期待通りに行われたかを確認
    expect(mockAxiosGet).toHaveBeenCalledWith('http://localhost:8000/api/v1/family-records/all', {
      params: { year: 2024, month: 7 },
      headers: { Authorization: 'Bearer mockToken' },
    });
  });
// フェッチに失敗した場合
  test('handles data fetch error', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]); // ログインユーザーをモック
    mockAxiosGet.mockRejectedValue(new Error('データの取得に失敗しました'));

    render(<CheckEmpty isEmpty={false} />);

    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    // エラーメッセージの表示を確認する
    expect(screen.getByText('データが読み込まれています...')).toBeInTheDocument();
  });
});
