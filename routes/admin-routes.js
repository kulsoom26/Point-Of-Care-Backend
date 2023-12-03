const express = require("express");
const adminController = require('../controllers/admin-controller');
const adminRouter = express.Router();

adminRouter.post("/api/admin/login", adminController.login);
adminRouter.post("/api/admin/updateAdmin", adminController.updateAdmin);
//Doctor
adminRouter.get("/api/admin/getDoctors", adminController.getDoctors);
adminRouter.post("/api/admin/addDoctor", adminController.addDoctor);
adminRouter.post("/api/admin/deleteDoctor", adminController.deleteDoctor);
adminRouter.post("/api/admin/updateDoctor", adminController.updateDoctor);
//Patient
adminRouter.get("/api/admin/getPatients", adminController.getPatients);
adminRouter.post("/api/admin/addPatient", adminController.addPatient);
adminRouter.post("/api/admin/deletePatient", adminController.deletePatient);
adminRouter.post("/api/admin/updatePatient", adminController.updatePatient);
//Radiologist
adminRouter.get("/api/admin/getRadiologists", adminController.getRadiologists);
adminRouter.post("/api/admin/addRadiologist", adminController.addRadiologist);
adminRouter.post("/api/admin/deleteRadiologist", adminController.deleteRadiologist);
adminRouter.post("/api/admin/updateRadiologist", adminController.updateRadiologist);
//Appointment
adminRouter.get("/api/admin/getAppointments", adminController.getAppointments);
adminRouter.post("/api/admin/deleteAppointment", adminController.deleteAppointment);
adminRouter.post("/api/admin/updateAppointment", adminController.updateAppointment);
////Report
//adminRouter.get("/api/admin/getReports", adminController.getReports);
//adminRouter.post("/api/admin/deleteReport", adminController.deleteReport);
module.exports = adminRouter;