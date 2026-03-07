export interface Artist {
  name?: string;
  nickname?: string;
  nationality?: string;
}

export interface Duration {
  start?: number;
  end?: number;
}

export class TrackEntity {

  constructor(
    public name?: string,
    public album?: string,
    public cover?: string,
    public artist?: Artist,
    public duration?: Duration,
    public url?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public uid?: string
  ) {}

  static fromObject(obj: any): TrackEntity {
    return new TrackEntity(
      obj.name,
      obj.album,
      obj.cover,
      obj.artist,
      obj.duration,
      obj.url,
      obj.createdAt,
      obj.updatedAt,
      obj.uid ?? obj._id
    );
  }

  toObject() {
    return {
      name: this.name,
      album: this.album,
      cover: this.cover,
      artist: this.artist,
      duration: this.duration,
      url: this.url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      uid: this.uid
    };
  }
}