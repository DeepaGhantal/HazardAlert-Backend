const Report = require('../models/Report');

// Get all reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ reportedAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new report
const createReport = async (req, res) => {
    try {
        const { title, description, location, imageUrl } = req.body;
        const newReport = new Report({ title, description, location, imageUrl });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: 'Error creating report' });
    }
};

module.exports = { getReports, createReport };
