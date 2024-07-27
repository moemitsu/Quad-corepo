// src/_components/analysis/__tests__/OpenaiAnalysis.test.tsx
'use client'
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OpenaiAnalysis from '../OpenaiAnalysis';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// firebase認証とaxiosとuseRouterをモック
jest.mock('react-firebase-hooks/auth');
jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('OpenaiAnalysis', () => {
  const mockUseAuthState = useAuthState as jest.Mock;
  const mockAxiosGet = axios.get as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseAuthState.mockReturnValue([null, false, null]);
    mockAxiosGet.mockResolvedValue({ data: { advice: '' } });
    mockUseRouter.mockReturnValue({ push: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
// ヘルパー関数を使用してコンポーネントをレンダリング
  const renderComponent = (props = {}) => {
    return render(
      <OpenaiAnalysis
        year={2024}
        month={7}
        selectedChildName="子供の名前"
        {...props}
      />
    );
  };
// ログインしていない場合
  test('ユーザーがログインしていないときにログインメッセージが表示されることを確認', () => {
    renderComponent();
    expect(screen.getByText('ログインしてください。')).toBeInTheDocument();
  });
// ログイン認証されている場合
  test('データが取得中の場合にローディングメッセージが表示されることを確認', async () => {
    mockUseAuthState.mockReturnValue([{ uid: '123' }, false, null]);
    renderComponent();

    fireEvent.click(screen.getByText('AIによる分析結果を表示する'));

    expect(screen.getByText('データ分析中...')).toBeInTheDocument();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());
  });

  test('データが取得された後に分析結果が表示されることを確認', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]);
    mockAxiosGet.mockResolvedValue({ data: { advice: '分析結果' } });

    renderComponent();
    fireEvent.click(screen.getByText('AIによる分析結果を表示する'));

    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    expect(screen.getByText('7月のAI分析結果です')).toBeInTheDocument();
    expect(screen.getByText('分析結果')).toBeInTheDocument();
  });

  test('データ取得に失敗したときにエラーメッセージが表示されることを確認', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]);
    mockAxiosGet.mockRejectedValue(new Error('データ取得に失敗しました'));

    renderComponent();
    fireEvent.click(screen.getByText('AIによる分析結果を表示する'));

    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
  });

  test('3回以上の分析表示後にオーバーレイが表示されることを確認', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]);
    mockAxiosGet.mockResolvedValue({ data: { advice: '分析結果' } });

    renderComponent();

    const button = screen.getByText('AIによる分析結果を表示する');

    fireEvent.click(button);
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(3));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    expect(screen.getByText('月3回以上のデータ分析はAI分析使い放題プランへのアップグレードが必要です')).toBeInTheDocument();
  });

  test('アップグレードボタンがクリックされたときに支払いページに遷移することを確認', async () => {
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]);
    mockAxiosGet.mockResolvedValue({ data: { advice: '分析結果' } });

    renderComponent();

    fireEvent.click(screen.getByText('AIによる分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(3));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    fireEvent.click(screen.getByText('AI分析使い放題プランへアップグレード'));

    expect(mockPush).toHaveBeenCalledWith('/payment');
  });

  test('「アップグレードしない」ボタンがクリックされたときにオーバーレイが非表示になることを確認', async () => {
    mockUseAuthState.mockReturnValue([{ getIdToken: jest.fn().mockResolvedValue('mockToken') }, false, null]);
    mockAxiosGet.mockResolvedValue({ data: { advice: '分析結果' } });

    renderComponent();

    fireEvent.click(screen.getByText('AIによる分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalledTimes(3));

    fireEvent.click(screen.getByText('更に分析結果を表示する'));
    fireEvent.click(screen.getByText('アップグレードしない'));

    expect(screen.queryByText('月3回以上のデータ分析はAI分析使い放題プランへのアップグレードが必要です')).not.toBeInTheDocument();
  });
});
