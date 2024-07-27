'use client'
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Introduction from '../introduction';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Introductionコンポーネント', () => {
  const useRouterMock = useRouter as jest.Mock;

  beforeEach(() => {
    useRouterMock.mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('画像とテキストが正しく表示される', () => {
    render(<Introduction />);

    // 画像の確認
    expect(screen.getByAltText('')).toHaveAttribute('src', 'Record1.png');
    expect(screen.getByAltText('')).toHaveAttribute('src', 'Chart3.png');
    expect(screen.getByAltText('')).toHaveAttribute('src', 'LLM応答1.png');

    // テキストの確認
    expect(screen.getByText('活動を残す')).toBeInTheDocument();
    expect(screen.getByText('過ごした時間を記録')).toBeInTheDocument();
    expect(screen.getByText('誰と、どのような活動（過ごし方）をしたか、ごきげん度などを記録します。')).toBeInTheDocument();

    expect(screen.getByText('時間を可視化')).toBeInTheDocument();
    expect(screen.getByText('過ごした時間をグラフ化')).toBeInTheDocument();
    expect(screen.getByText('月別に記録データを集計。時間の割合が一目で分かります。')).toBeInTheDocument();

    expect(screen.getByText('プランの提案')).toBeInTheDocument();
    expect(screen.getByText('AIによる分析と提案')).toBeInTheDocument();
    expect(screen.getByText('家族が喜ぶ、最適な過ごし方をご提案します（※）。')).toBeInTheDocument();
    expect(screen.getByText('※3回まで無料お試しが可能。')).toBeInTheDocument();
    expect(screen.getByText('800円/月でAI分析使い放題プランに加入できます。')).toBeInTheDocument();
  });

  test('ボタンをクリックすると月次分析ページに遷移する', () => {
    const { push } = useRouterMock();

    render(<Introduction />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(push).toHaveBeenCalledWith('/monthly-analysis');
  });
});