const useRouter = jest.fn();

useRouter.mockImplementation(() => ({
  push: jest.fn(),
  prefetch: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
}));

module.exports = {
  useRouter,
};
