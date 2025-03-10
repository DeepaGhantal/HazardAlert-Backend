const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
