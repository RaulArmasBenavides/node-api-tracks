"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackModel = void 0;
// src/models/tracks.ts
const mongoose_1 = require("mongoose");
const TrackSchema = new mongoose_1.Schema({
    name: { type: String },
    album: { type: String },
    cover: { type: String },
    artist: {
        name: { type: String },
        nickname: { type: String },
        nationality: { type: String },
    },
    duration: {
        start: { type: Number },
        end: { type: Number },
    },
    url: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});
// toJSON: remueve __v/_id y expone uid (opcionalmente quita password si existiera)
TrackSchema.set("toJSON", {
    versionKey: false,
    transform: (_doc, ret) => {
        const { __v, _id, password, ...rest } = ret;
        return { ...rest, uid: _id };
    },
});
exports.TrackModel = (0, mongoose_1.model)("tracks", TrackSchema);
exports.default = exports.TrackModel;
