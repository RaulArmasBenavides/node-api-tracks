export type JwtPayload = {
  _id?: string;   // según tu generateToken puede ser _id
  id?: string;    // o id
  role?: string;
  [k: string]: unknown;
};
