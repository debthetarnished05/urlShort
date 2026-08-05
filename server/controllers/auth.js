import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

function signToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}


export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });
        const token = signToken(user._id);

        return res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Register error:", err);
        if (err.code === 11000) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        return res.status(500).json({ error: "Registration failed. Please try again." });
    }
}

// POST /auth/login
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = signToken(user._id);

        return res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed. Please try again." });
    }
}


export async function getMe(req, res) {
    try {
        return res.json({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
        });
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch user." });
    }
}
