const bcrypt = require("bcryptjs");
const Admin = require('../models/admin');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Radiologist = require('../models/radiologist');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
//const Report = require('../models/report');

const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('incorrect email');
            return res.status(400).json({ message: "Incorrect email!" });
        }
        if (admin.password != password) {
            console.log('incorrect password')
            return res.status(400).json({ message: "Incorrect password!"});
        }

        console.log(admin);
        res.json({ admin, message: "Successfully logged in!"});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { name, email, contact, password } = req.body;

    if (!email || !name || !contact || !password) {
      return res.status(400).json({ msg: "Please fill all the fields!" });
    }

    const updatedAdmin = await Admin.findOneAndUpdate(
      { email: email },
      { name: name, contact: contact, password: password },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log(updatedAdmin);
    res.status(200).json({ updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              contact: 1,
              gender: 1,
              image: 1,
              specialization: 1,
              description: 1,
              experience: 1,
              fees: 1,
              time: 1,
              _id: '$user._id',
              name: '$user.name',
              email: '$user.email',
              role: '$user.role',
              password: '$user.password',
            },
          },
        ]);

        res.json(doctors);
      } catch (error) {
        console.error('Error getting doctors with users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const addDoctor = async (req, res, next) => {
     try {
        // Step 1: Create a new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Step 2: Create a new doctor with the reference to the created user
        const newDoctor = new Doctor({
          contact: req.body.contact,
          gender: req.body.gender,
          image: req.body.image,
          specialization: req.body.specialization,
          description: req.body.description,
          experience: req.body.experience,
          fees: req.body.fees,
          time: req.body.time,
          userId: savedUser._id,
        });
        const savedDoctor = await newDoctor.save();

        res.json({savedDoctor, msg: "Doctor added"});
      } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const updateDoctor = async (req, res, next) => {
    try {
        const { email, name, contact, gender, specialization, experience, description, time, fees, image } = req.body;
        if (!email || !name || !contact || !gender || !specialization || !experience || !description || !time || !fees) {
            return res.status(400).json({ msg: "Please fill all the fields!" });
        }

        // Check if the email exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        const updatedUser = await User.findOneAndUpdate({ email }, { name }, { new: true });

        const updatedDoctor = await Doctor.findOneAndUpdate({ userId: existingUser._id }, {
            image,
            contact,
            gender,
            specialization,
            experience,
            description,
            time,
            fees
        }, { new: true });

        if (!updatedDoctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }

        console.log("Updated User:", updatedUser);
        console.log("Updated Doctor:", updatedDoctor);

        const update = {
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedDoctor.image,
            contact: updatedDoctor.contact,
            gender: updatedDoctor.gender,
            specialization: updatedDoctor.specialization,
            experience: updatedDoctor.experience,
            description: updatedDoctor.description,
            time: updatedDoctor.time,
            fees: updatedDoctor.fees
        }

        res.status(200).json(update);
    } catch (error) {
        console.error('Error updating profiles:', error);
        res.status(500).json({ error: error.message });
    }
}

const deleteDoctor = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await User.findByIdAndDelete(itemId);
    await Doctor.findOneAndDelete({ userId: itemId });
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPatients = async (req, res, next) => {
    try {
        const patients = await Patient.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              contact: 1,
              gender: 1,
              image: 1,
              userName: 1,
              age: 1,
              _id: '$user._id',
              name: '$user.name',
              email: '$user.email',
              role: '$user.role',
              password: '$user.password',
            },
          },
        ]);

        res.json(patients);
    } catch (error) {
        console.error('Error getting patients with users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addPatient = async (req, res, next) => {
    try {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        });
        const savedUser = await newUser.save();
        const newPatient = new Patient({
          contact: req.body.contact,
          gender: req.body.gender,
          image: req.body.image,
          userName: req.body.userName,
          age: req.body.age,
          userId: savedUser._id,
        });
        const savedPatient = await newPatient.save();

        res.json({savedPatient, msg: "Patient added"});
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePatient = async (req, res, next) => {
    try {
        const { email, name, contact, gender, userName, age, image } = req.body;
         if (!email || !name || !contact || !gender || !age || !userName) {
             return res.status(400).json({ msg: "Please fill all the fields!" });
         }
         const existingUser = await User.findOne({ email });
         if (!existingUser) {
             return res.status(404).json({ msg: "User not found" });
         }
         const updatedUser = await User.findOneAndUpdate({ email }, { name }, { new: true });

         const updatedPatient = await Patient.findOneAndUpdate({ userId: existingUser._id }, {
             image,
             contact,
             gender,
             age,
             userName,
         }, { new: true });

         if (!updatedPatient) {
             return res.status(404).json({ msg: "Patient not found" });
         }

         console.log("Updated User:", updatedUser);
         console.log("Updated Patient:", updatedPatient);

         const update = {
             name: updatedUser.name,
             email: updatedUser.email,
             image: updatedPatient.image,
             contact: updatedPatient.contact,
             gender: updatedPatient.gender,
             age: updatedPatient.age,
             userName: updatedPatient.userName,
         }

         res.status(200).json(update);
    } catch (error) {
         console.error('Error updating profiles:', error);
         res.status(500).json({ error: error.message });
    }
};

const deletePatient = async (req, res, next) => {
    try {
        const { itemId } = req.body;
        console.log(itemId);
        await User.findByIdAndDelete(itemId);
        await Patient.findOneAndDelete({ userId: itemId });
        res.status(200).json({ message: 'Patient deleted successfully.' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getRadiologists = async (req, res, next) => {
    try {
        const radiologists = await Radiologist.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              contact: 1,
              gender: 1,
              image: 1,
              userName: 1,
              age: 1,
              _id: '$user._id',
              name: '$user.name',
              email: '$user.email',
              role: '$user.role',
              password: '$user.password',
            },
          },
        ]);

        res.json(radiologists);
    } catch (error) {
        console.error('Error getting radiologists with users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addRadiologist = async (req, res, next) => {
    try {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        });
        const savedUser = await newUser.save();
        const newRadiologist = new Radiologist({
          contact: req.body.contact,
          gender: req.body.gender,
          image: req.body.image,
          userName: req.body.userName,
          age: req.body.age,
          userId: savedUser._id,
        });
        const savedRadiologist = await newRadiologist.save();

        res.json({savedRadiologist, msg: "Radiologist added"});
    } catch (error) {
        console.error('Error adding radiologist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateRadiologist = async (req, res, next) => {
    try {
        const { email, name, contact, gender, userName, age, image } = req.body;
         if (!email || !name || !contact || !gender || !age || !userName) {
             return res.status(400).json({ msg: "Please fill all the fields!" });
         }
         const existingUser = await User.findOne({ email });
         if (!existingUser) {
             return res.status(404).json({ msg: "User not found" });
         }
         const updatedUser = await User.findOneAndUpdate({ email }, { name }, { new: true });

         const updatedRadiologist = await Radiologist.findOneAndUpdate({ userId: existingUser._id }, {
             image,
             contact,
             gender,
             age,
             userName,
         }, { new: true });

         if (!updatedRadiologist) {
             return res.status(404).json({ msg: "Radiologist not found" });
         }

         console.log("Updated User:", updatedUser);
         console.log("Updated Patient:", updatedRadiologist);

         const update = {
             name: updatedUser.name,
             email: updatedUser.email,
             image: updatedRadiologist.image,
             contact: updatedRadiologist.contact,
             gender: updatedRadiologist.gender,
             age: updatedRadiologist.age,
             userName: updatedRadiologist.userName,
         }

        res.status(200).json(update);
    } catch (error) {
         console.error('Error updating profiles:', error);
         res.status(500).json({ error: error.message });
    }
};

const deleteRadiologist = async (req, res, next) => {
    try {
        const { itemId } = req.body;
        console.log(itemId);
        await User.findByIdAndDelete(itemId);
        await Radiologist.findOneAndDelete({ userId: itemId });
        res.status(200).json({ message: 'Radiologist deleted successfully.' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctorUser',
            },
          },
          {
            $unwind: '$doctorUser',
          },
          {
            $project: {
              time: 1,
              reason: 1,
              contact: 1,
              gender: 1,
              name: 1,
              status: 1,
              age: 1,
              date: 1,
              email: '$user.email',
              doctorName: '$doctorUser.name',
            },
          },
        ]);

        console.log('Appointments:', appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error getting appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateAppointment = async (req, res, next) => {
  try {
    const {name, contact, gender, status, age, time, reason, date, _id } = req.body;
    if (!name || !contact || !gender || !age || !status || !time || !reason || !date) {
      return res.status(400).json({ msg: 'Please fill all the fields!' });
    }
    const existingAppointment = await Appointment.findOne({ _id });
    if (!existingAppointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id },
      {
        name,
        contact,
        gender,
        age,
        status,
        time,
        reason,
        date,
      },
      { new: true }
    );
    const update = {
      name: updatedAppointment.name,
      contact: updatedAppointment.contact,
      gender: updatedAppointment.gender,
      age: updatedAppointment.age,
      status: updatedAppointment.status,
      time: updatedAppointment.time,
      reason: updatedAppointment.reason,
      date: updatedAppointment.date,
    };

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointments:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res, next) => {
    try {
        const { itemId } = req.body;
        console.log(itemId);
        await Appointment.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



exports.login = login;
exports.updateAdmin = updateAdmin;
exports.getDoctors = getDoctors;
exports.addDoctor = addDoctor;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
exports.getPatients = getPatients;
exports.addPatient = addPatient;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;
exports.getRadiologists = getRadiologists;
exports.addRadiologist = addRadiologist;
exports.updateRadiologist = updateRadiologist;
exports.deleteRadiologist = deleteRadiologist;
exports.getAppointments = getAppointments;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;