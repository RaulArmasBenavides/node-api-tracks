import { encrypt, compare } from '../handleBcrypt';

describe('handleBcrypt', () => {
  describe('encrypt', () => {
    it('should encrypt a password', async () => {
      const password = 'mySecurePassword123';
      const encrypted = await encrypt(password);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(password);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await encrypt(password);
      const hash2 = await encrypt(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true when password matches hash', async () => {
      const password = 'mySecurePassword123';
      const hash = await encrypt(password);
      const match = await compare(password, hash);

      expect(match).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      const password = 'mySecurePassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await encrypt(password);
      const match = await compare(wrongPassword, hash);

      expect(match).toBe(false);
    });

    it('should handle empty passwords', async () => {
      const hash = await encrypt('');
      const match = await compare('', hash);

      expect(match).toBe(true);
    });
  });
});
