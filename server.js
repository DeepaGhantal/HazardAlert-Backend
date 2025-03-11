const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "https://your-netlify-site.netlify.app" })); // Replace with actual Netlify frontend URL
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
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    severity: String,
    status: { type: String, default: "reported" }, // Default status
    reportedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resolutionDetails: String,
    resolutionDate: Date
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

// UPDATE hazard status (PATCH)
app.patch("/api/hazards/:id", async (req, res) => {
    try {
        const { status, resolutionDetails } = req.body;
        const updateFields = { status, updatedAt: Date.now() };

        // If hazard is resolved, add resolution details
        if (status === "resolved") {
            updateFields.resolutionDetails = resolutionDetails;
            updateFields.resolutionDate = Date.now();
        }

        const updatedHazard = await Hazard.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedHazard) {
            return res.status(404).json({ message: "Hazard not found" });
        }

        res.json(updatedHazard);
    } catch (err) {
        res.status(500).json({ message: "Error updating hazard" });
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
