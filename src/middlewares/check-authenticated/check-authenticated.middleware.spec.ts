import { CheckAuthenticatedMiddleware } from './check-authenticated.middleware';

describe('CheckAuthenticatedMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckAuthenticatedMiddleware()).toBeDefined();
  });
});
