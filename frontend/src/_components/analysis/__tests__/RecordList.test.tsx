'use client'
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import RecordList from '../RecordList';

jest.mock('axios');

describe('RecordList', () => {
  const mockAxiosGet = axios.get as jest.Mock;

  const renderComponent = (props = {}) => {
    return render(
      <RecordList
        selectedYear={2024}
        selectedMonth={7}
        selectedChildName="子供の名前"
        bearerToken="mockBearerToken"
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockAxiosGet.mockResolvedValue({
      data: [
        {
          id: 1,
          with_member: '父親',
          events: '遊び',
          child_condition: '良い',
          place: '公園',
          share_start_at: '2024-07-01T10:00:00Z',
          share_end_at: '2024-07-01T12:00:00Z',
        },
        {
          id: 2,
          with_member: '母親',
          events: '勉強',
          child_condition: '普通',
          place: '家',
          share_start_at: '2024-07-02T14:00:00Z',
          share_end_at: '2024-07-02T15:00:00Z',
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('初期状態で読み込み中のメッセージが表示される', () => {
    renderComponent();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  test('データ取得後に記録が表示される', async () => {
    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    expect(screen.getByText('7月の子供の名前さんの記録リスト')).toBeInTheDocument();
    expect(screen.getByText('父親')).toBeInTheDocument();
    expect(screen.getByText('遊び')).toBeInTheDocument();
    expect(screen.getByText('良い')).toBeInTheDocument();
    expect(screen.getByText('公園')).toBeInTheDocument();
    expect(screen.getByText('2024/7/1 19:00:00')).toBeInTheDocument(); // JST time conversion
    expect(screen.getByText('2024/7/1 21:00:00')).toBeInTheDocument(); // JST time conversion
  });

  test('データ取得に失敗した場合にエラーメッセージが表示される', async () => {
    mockAxiosGet.mockRejectedValue(new Error('データの取得に失敗しました'));

    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
  });

  test('with_memberフィルターで記録が絞り込まれる', async () => {
    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.change(screen.getByDisplayValue('保護者で絞り込む'), {
      target: { value: '父親' },
    });

    expect(screen.queryByText('母親')).not.toBeInTheDocument();
    expect(screen.getByText('父親')).toBeInTheDocument();
  });

  test('eventsフィルターで記録が絞り込まれる', async () => {
    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.change(screen.getByDisplayValue('イベントで絞り込む'), {
      target: { value: '遊び' },
    });

    expect(screen.queryByText('勉強')).not.toBeInTheDocument();
    expect(screen.getByText('遊び')).toBeInTheDocument();
  });

  test('child_conditionフィルターで記録が絞り込まれる', async () => {
    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.change(screen.getByDisplayValue('ご機嫌で絞り込む'), {
      target: { value: '良い' },
    });

    expect(screen.queryByText('普通')).not.toBeInTheDocument();
    expect(screen.getByText('良い')).toBeInTheDocument();
  });

  test('placeフィルターで記録が絞り込まれる', async () => {
    renderComponent();
    await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

    fireEvent.change(screen.getByDisplayValue('場所で絞り込む'), {
      target: { value: '公園' },
    });

    expect(screen.queryByText('家')).not.toBeInTheDocument();
    expect(screen.getByText('公園')).toBeInTheDocument();
  });
});