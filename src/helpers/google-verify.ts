// src/helpers/google-verify.ts
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleVerify(token: string): Promise<{
  name: string;
  email: string;
  picture?: string;
}> {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing GOOGLE_CLIENT_ID env var");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Google token without email");
  }

  return {
    name: payload.name ?? "",
    email: payload.email,
    picture: payload.picture,
  };
}

export default googleVerify;
