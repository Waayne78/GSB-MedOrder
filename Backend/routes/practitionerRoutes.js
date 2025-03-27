const express = require('express');
const router = express.Router();
const practitionerController = require('../controllers/practitionerController');

router.get('/practitioners', practitionerController.getAllPractitioners);

router.post('/practitioners', practitionerController.createPractitioner);

module.exports = router;
