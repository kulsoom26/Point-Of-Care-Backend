const express = require("express");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");
const appointmentController = require('../controllers/appointments-controller');
const appointmentRouter = express.Router();
// const jwt = require("jsonwebtoken");

appointmentRouter.post("/api/user/addAppointment", appointmentController.addAppointment);

appointmentRouter.get("/api/user/getAppointments", appointmentController.getAppointment);

appointmentRouter.post("/api/user/updateAppointment/:id", appointmentController.updateAppointment);

appointmentRouter.post("/api/user/cancelAppointment", appointmentController.cancelAppointment);

appointmentRouter.post("/api/user/completeAppointment/:id", appointmentController.completeAppointment);

appointmentRouter.get("/api/user/getSingleAppointment/:id", appointmentController.getSingleAppointment);

module.exports = appointmentRouter;