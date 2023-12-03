const express = require('express');
const { check } = require('express-validator');
const fileUpload = require("../middleware/file-upload");

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/doctors', usersController.getDoctors);
router.get('/patients', usersController.getPatients);
router.get('/radiologists', usersController.getRadiologists);

router.post('/emailVerification', usersController.emailVerification);
router.post('/passwordReset', usersController.passwordReset);

router.post('/signup',
    fileUpload.single('image'),
    usersController.signup);

router.post('/login', usersController.login);

router.post('/addDoctor', usersController.addDoctor);

router.post('/addRadiologist', usersController.addRadiologist);

router.post('/addPatient', usersController.addPatient);

router.post('/updatePatient', usersController.updatePatient);
router.post('/addFeedback', usersController.addFeedback);

module.exports = router;
