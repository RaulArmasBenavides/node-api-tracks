import { UserEntity } from '../user.entity';

describe('UserEntity', () => {
  describe('constructor', () => {
    it('should create a user entity with required fields', () => {
      const user = new UserEntity(
        '1',
        'John Doe',
        'john@example.com',
        'hashedPassword',
      );

      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('hashedPassword');
      expect(user.role).toBe('USER_ROLE');
      expect(user.google).toBe(false);
    });

    it('should create a user entity with all fields', () => {
      const now = new Date();
      const user = new UserEntity(
        '1',
        'John Doe',
        'john@example.com',
        'hashedPassword',
        30,
        'ADMIN_ROLE',
        'profile.jpg',
        true,
        now,
        now,
      );

      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(30);
      expect(user.role).toBe('ADMIN_ROLE');
      expect(user.img).toBe('profile.jpg');
      expect(user.google).toBe(true);
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });

  describe('fromObject', () => {
    it('should create a user entity from plain object', () => {
      const obj = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        age: 25,
        role: 'USER_ROLE',
        img: 'avatar.jpg',
        google: false,
      };

      const user = UserEntity.fromObject(obj);

      expect(user.id).toBe(obj.id);
      expect(user.name).toBe(obj.name);
      expect(user.email).toBe(obj.email);
      expect(user.age).toBe(obj.age);
      expect(user.role).toBe(obj.role);
    });

    it('should use default role if not provided', () => {
      const obj = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const user = UserEntity.fromObject(obj);

      expect(user.role).toBe('USER_ROLE');
    });

    it('should use default google value if not provided', () => {
      const obj = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const user = UserEntity.fromObject(obj);

      expect(user.google).toBe(false);
    });
  });

  describe('toObject', () => {
    it('should convert user entity to plain object', () => {
      const now = new Date();
      const user = new UserEntity(
        '1',
        'John Doe',
        'john@example.com',
        'hashedPassword',
        30,
        'ADMIN_ROLE',
        'profile.jpg',
        true,
        now,
        now,
      );

      const obj = user.toObject();

      expect(obj.id).toBe('1');
      expect(obj.name).toBe('John Doe');
      expect(obj.email).toBe('john@example.com');
      expect(obj.age).toBe(30);
      expect(obj.role).toBe('ADMIN_ROLE');
      expect(obj.img).toBe('profile.jpg');
      expect(obj.google).toBe(true);
      expect(obj.createdAt).toBe(now);
      expect(obj.updatedAt).toBe(now);
    });
  });
});
