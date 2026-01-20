const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(__dirname));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ✅ DEFINE MODEL ONCE (FIXED)
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  inviteCode: String
});

const User = mongoose.model("User", userSchema);

// ✅ Root → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Signup (FIXED)
app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, inviteCode } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    await new User({ fullName, email, password, inviteCode }).save();
    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login (FIXED)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      fullName: user.fullName,
      email: user.email,
      inviteCode: user.inviteCode
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
