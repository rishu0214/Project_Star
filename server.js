const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 ROOT ROUTE
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Star Plaza Backend is Live 🚀",
        status: "OK"
    });
});

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));

// 🔹 User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    inviteCode: String
});

const User = mongoose.model("User", UserSchema);

// 🔹 SIGNUP
app.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password, inviteCode } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ fullName, email, password, inviteCode });
        await user.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            fullName: user.fullName,
            email: user.email,
            inviteCode: user.inviteCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
