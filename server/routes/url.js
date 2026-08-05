import express from "express";
import { generateShortURL, handleGetAnalytics, handleDelete, updateUrl, getAllUrls } from "../controllers/url.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, generateShortURL);
router.put("/:shortId", verifyToken, updateUrl);
router.delete("/:shortId", verifyToken, handleDelete);
router.get("/all", verifyToken, getAllUrls);


router.get("/analytics/:shortId", handleGetAnalytics);

export default router;