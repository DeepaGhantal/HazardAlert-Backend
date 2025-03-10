const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Define Hazard Schema & Model
const hazardSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    severity: String,
    date: { type: Date, default: Date.now }
});

const Hazard = mongoose.model("Hazard", hazardSchema);

// Routes
app.get("/", (req, res) => {
    res.send("🚀 HazardAlert API is running...");
});

// GET all hazards
app.get("/api/hazards", async (req, res) => {
    try {
        const hazards = await Hazard.find();
        res.json(hazards);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST a new hazard
app.post("/api/hazards", async (req, res) => {
    try {
        const { title, description, location, severity } = req.body;
        const newHazard = new Hazard({ title, description, location, severity });
        await newHazard.save();
        res.status(201).json(newHazard);
    } catch (err) {
        res.status(400).json({ message: "Error creating hazard" });
    }
});

// DELETE a hazard
app.delete("/api/hazards/:id", async (req, res) => {
    try {
        await Hazard.findByIdAndDelete(req.params.id);
        res.json({ message: "Hazard deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting hazard" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
