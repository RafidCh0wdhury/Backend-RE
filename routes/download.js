const express = require('express');
const { downloadResource } = require('../controllers/download');

const router = express.Router();

router.get("/download-resource", downloadResource);

module.exports = router;