const express = require('express');
const { getReports, createReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/', getReports);
router.post('/', createReport);

module.exports = router;
