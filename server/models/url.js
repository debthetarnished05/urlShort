import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        urlId: {
            type: String,
            required: true,
            unique: true,
        },
        originalURL: {
            type: String,
            required: true,
        },
        visitHistory: [
            {
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true }
);

export const URL = mongoose.model("Url", urlSchema);
