export class CategoryEntity {

  constructor(
    public name: string,
    public uid?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static fromObject(obj: any): CategoryEntity {
    return new CategoryEntity(
      obj.name,
      obj.uid ?? obj._id?.toString(),
      obj.createdAt,
      obj.updatedAt
    );
  }

  toObject() {
    return {
      name: this.name,
      uid: this.uid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}