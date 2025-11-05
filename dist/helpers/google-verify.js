"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleVerify = googleVerify;
// src/helpers/google-verify.ts
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function googleVerify(token) {
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
exports.default = googleVerify;
