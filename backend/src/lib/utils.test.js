import jwt from "jsonwebtoken";
import { generateRandomBase64String, generateToken } from './utils.js';

describe('Utils Tests', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  describe('generateRandomBase64String', () => {
    test('should generate a base64 string of expected length and characters', () => {
      const size = 32;
      const result = generateRandomBase64String(size);

      expect(typeof result).toBe('string');

      // Base64 length is roughly 4/3 of byte size, rounded up to multiple of 4
      const expectedMinLength = Math.ceil((size * 4) / 3);
      expect(result.length).toBeGreaterThanOrEqual(expectedMinLength);

      expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
    });
  });

  describe('generateToken', () => {
    test('should generate a JWT token and set cookie on response', () => {
      const userId = '12345';
      const mockRes = {
        cookie: jest.fn(),
      };

      const token = generateToken(userId, mockRes);

      expect(typeof token).toBe('string');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        token,
        expect.objectContaining({
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV !== 'development',
        })
      );

      // Verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
    });
  });
});
