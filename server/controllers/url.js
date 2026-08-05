import {nanoid} from "nanoid";
import {URL} from "../models/url.js";

export async function generateShortURL(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: "url is required" });

        const shortId = nanoid(8);
        await URL.create({
            urlId: shortId,
            originalURL: body.url,
            visitHistory: [],
            userId: req.user._id,
        });
        return res.json({ id: shortId });
    } catch (err) {
        console.error("generateShortURL error:", err);
        return res.status(500).json({ error: "Failed to create short URL." });
    }
}

export async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ urlId: shortId });

        if (!result) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (err) {
        console.error("handleGetAnalytics error:", err);
        return res.status(500).json({ error: "Failed to fetch analytics." });
    }
}

export async function handleRedirects(req, res) {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { urlId: shortId },
            { $push: { visitHistory: {} } }
        );
        if (!entry) {
            return res.status(404).json({ message: "Short URL not found" });
        }
        res.redirect(entry.originalURL);
    } catch (err) {
        console.error("handleRedirects error:", err);
        return res.status(500).json({ error: "Redirect failed." });
    }
}

export async function handleDelete(req, res) {
    try {
        const urlId = req.params.shortId;
        const removed = await URL.findOneAndDelete({
            urlId,
            userId: req.user._id,
        });

        if (!removed) {
            return res.status(404).json({ message: "Short URL not found or not authorized." });
        }

        return res.status(200).json({ message: "URL deleted successfully" });
    } catch (err) {
        console.error("handleDelete error:", err);
        return res.status(500).json({ error: "Failed to delete URL." });
    }
}

export async function updateUrl(req, res) {
    try {
        const urlId = req.params.shortId;
        const { url } = req.body;

        if (!url) return res.status(400).json({ error: "url is required" });

        const updatedUrl = await URL.findOneAndUpdate(
            { urlId, userId: req.user._id },
            { originalURL: url },
            { new: true, runValidators: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: "Short URL not found or not authorized." });
        }

        return res.json(updatedUrl);
    } catch (err) {
        console.error("updateUrl error:", err);
        return res.status(500).json({ error: "Failed to update URL." });
    }
}

export async function getAllUrls(req, res) {
    try {
        const urls = await URL.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json(urls);
    } catch (err) {
        console.error("getAllUrls error:", err);
        return res.status(500).json({ error: "Failed to fetch URLs." });
    }
}