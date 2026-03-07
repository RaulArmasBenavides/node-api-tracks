export type UserRole = 'USER_ROLE' | 'ADMIN_ROLE';

export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public age?: number,
    public role: UserRole = 'USER_ROLE',
    public img?: string,
    public google: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static fromObject(obj: any): UserEntity {
    return new UserEntity(
      obj.id,
      obj.name,
      obj.email,
      obj.password,
      obj.age,
      obj.role ?? 'USER_ROLE',
      obj.img,
      obj.google ?? false,
      obj.createdAt,
      obj.updatedAt
    );
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
      password: this.password,
      role: this.role,
      img: this.img,
      google: this.google,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}