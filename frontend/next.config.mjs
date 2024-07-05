// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['localhost'], // 必要に応じてドメインを追加
    },
    webpack: (config, { isServer }) => {
      // 必要に応じてWebpackの設定を追加
      return config;
    },
  };
  
  export default nextConfig;
  