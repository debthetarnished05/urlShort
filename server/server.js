import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.js";
import authRoutes from "./routes/auth.js";
import redirectRoutes from "./routes/redirects.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/url", urlRoutes);
app.use("/", redirectRoutes);

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: messages.join(", ") });
    }

    if (err.code === 11000) {
        return res.status(409).json({ error: "Duplicate entry. Resource already exists." });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    return res.status(err.status || 500).json({
        error: err.message || "Internal server error.",
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));