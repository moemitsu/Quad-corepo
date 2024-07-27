'use client'
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import '@testing-library/jest-dom';

describe('Footerコンポーネント', () => {
  test('ブランド名が正しく表示される', () => {
    render(<Footer />);
    const brandElement = screen.getByLabelText('Brand');
    expect(brandElement).toHaveTextContent('Quad');
  });

  test('Ms.Engineerリンクが正しく表示される', () => {
    render(<Footer />);
    const msEngineerLink = screen.getByText('Ms.Engineer');
    expect(msEngineerLink).toBeInTheDocument();
    expect(msEngineerLink).toHaveAttribute('href', '#');
  });

  test('コピーライトが正しく表示される', () => {
    render(<Footer />);
    const copyrightElement = screen.getByText(/© Preline. 2024 MsE All rights reserved./);
    expect(copyrightElement).toBeInTheDocument();
  });

  test('ソーシャルアイコンが全て表示される', () => {
    render(<Footer />);
    const socialIcons = screen.getAllByRole('link');
    expect(socialIcons.length).toBe(4); // ソーシャルアイコンの数を確認
  });

  test('ソーシャルアイコンのリンクが正しく設定されている', () => {
    render(<Footer />);
    const googleIcon = screen.getByLabelText('Google');
    expect(googleIcon).toHaveAttribute('href', '#');

    // 他のソーシャルアイコンのリンクも同様にテスト
    const githubIcon = screen.getByLabelText('GitHub');
    expect(githubIcon).toHaveAttribute('href', '#');

    const dribbbleIcon = screen.getByLabelText('Dribbble');
    expect(dribbbleIcon).toHaveAttribute('href', '#');

  });
});