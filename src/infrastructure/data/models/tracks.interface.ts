export interface IArtist {
  name?: string;
  nickname?: string;
  nationality?: string;
}

export interface IDuration {
  start?: number;
  end?: number;
}

export interface ITrack extends Document {
  name?: string;
  album?: string;
  cover?: string;
  artist?: IArtist;
  duration?: IDuration;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // for the toJSON transform
  uid?: string;
}
