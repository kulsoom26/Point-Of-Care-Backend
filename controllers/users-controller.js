const { validationResult } = require('express-validator');
const bcryptjs = require("bcryptjs");
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Radiologist = require('../models/radiologist');
const Patient = require('../models/patient');
const Feedback = require('../models/feedback');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getDoctors = async (req, res, next) => {
  let doctors;
  try {
    doctors = await Doctor.find({});
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Fetching doctors failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ doctors: doctors.map(doctor => doctor.toObject({ getters: true })) });
};

const getPatients = async (req, res, next) => {
  let patients;
  try {
    patients = await Patient.find({});
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Fetching patients failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ patients: patients.map(patient => patient.toObject({ getters: true })) });
};

const getRadiologists = async (req, res, next) => {
  let radiologists;
  try {
    radiologists = await Radiologist.find({});
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Fetching radiologists failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ radiologists: radiologists.map(radiologist => radiologist.toObject({ getters: true })) });
};

const emailVerification = async (req, res) => {
  try {
    const { email} = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log(false);
        return res.json(false);
    }
    else{
        console.log(true);
        return res.json(user);
    }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const passwordReset = async (req, res) => {
  try {
    const { email, password, confirmPassword} = req.body;
    if (password != confirmPassword) {
        return res.status(400).json({ msg: "Please match the password!" });
    }
    const user = await User.findOne({ email });
    const hashedPassword = await bcryptjs.hash(password, 8);
    user.password = password;
    await user.save();
    res.status(200).json({ msg: "Password updated successfully!" });
    
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    role,
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true })
  });
};

const addDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userId, contact, gender, experience, time, fees, image, specialization, description } = req.body;

  const createdDoctor = new Doctor({
    contact,
    gender,
    image,
    specialization,
    description,
    experience,
    fees,
    time,
    userId,
  });
  console.log(createdDoctor);

  try {
    await createdDoctor.save();
  } catch (err) {
    const error = new HttpError(
      'Creating doctor failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ doctor: createdDoctor.toObject({ getters: true }) });
};

const addRadiologist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userId, age, contact, gender, image } = req.body;

  const createdRadiologist = new Radiologist({
    userId,
    age,
    image,
    gender,
    contact,
  });
  console.log(createdRadiologist);

  try {
    await createdRadiologist.save();
  } catch (err) {
    const error = new HttpError(
      'Creating radiologist failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ radiologist: createdRadiologist.toObject({ getters: true }) });
};

const addPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userId, age, contact, gender, image } = req.body;

  const createdPatient = new Patient({
    userId,
    age,
    contact,
    gender,
    image
  });
  console.log(createdPatient);

  try {
    await createdPatient.save();
  } catch (err) {
    const error = new HttpError(
      'Creating patient failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ patient: createdPatient.toObject({ getters: true }) });
};


const updatePatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userId, contact, gender, age, image } = req.body;
  console.log(contact);

  try {
    // Use findOneAndUpdate to update the patient
    const updatedPatient = await Patient.findOneAndUpdate(
      { userId },
      { $set: { age, contact, gender, image } },
      { new: true }
    );

    if (!updatedPatient) {
      const error = new HttpError('Could not find patient for the provided userId.', 404);
      return next(error);
    }
    console.log(updatedPatient)

    res.status(200).json({ patient: updatedPatient.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update patient.',
      500
    );
    return next(error);
  }
};

const addFeedback = async (req, res, next) => {
    const {userId, feedback, rating} = req.body;

    console.log(feedback);
    try {
        if (!feedback || !rating) {
            return res.status(400).json({ msg: "Please fill the field and stars!" });
        }

        const newFeedback = new Feedback({
            userId,
            feedback,
            rating
        });
        console.log(newFeedback);
        await newFeedback.save();

        res.status(200).json({ msg: "Feedback recieved, Thank you!" });
    } catch (error) {
          console.error(error);
          return res.status(500).json({ msg: "Internal server error. Please try later." });
      }
};



exports.getUsers = getUsers;
exports.getDoctors = getDoctors;
exports.getPatients = getPatients;
exports.getRadiologists = getRadiologists;
exports.emailVerification = emailVerification;
exports.passwordReset = passwordReset;
exports.signup = signup;
exports.login = login;
exports.addDoctor = addDoctor;
exports.addPatient = addPatient;
exports.addRadiologist = addRadiologist;
exports.updatePatient = updatePatient;
exports.addFeedback = addFeedback;