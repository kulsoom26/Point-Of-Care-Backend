
const Appointment = require("../models/appointment");
const HttpError = require("../models/http-error");

const getAppointment = async (req, res, next) => {
    let appointments;
    try {
        appointments = await Appointment.find({});
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Fetching appointment failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ appointments: appointments.map(appointment => appointment.toObject({ getters: true })) });
}


const addAppointment = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return next(
    //         new HttpError('Invalid inputs passed, please check your data.', 422)
    //     );
    // }
    const { doctorId, userId, contact, gender, reason, status, date, name, age, time } = req.body;

    let existingAppointment;
    try {
        if (!time || !name || !contact || !gender || !reason || !status || !date || !age) {
            const error = new HttpError(
                "Please fill all the fields!",
                422
            );
            return next(error);
        }
        existingAppointment = await Appointment.findOne({
            doctorId,
            date,
            time
        });
    } catch (err) {
        const error = new HttpError(
            'Creating Appointment failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingAppointment) {
        const error = new HttpError(
            "Doctor already has an appointment at the requested time.",
            422);
        return next(error);
    }

    const appointment = new Appointment({
        doctorId,
        userId,
        time,
        reason,
        name,
        status,
        gender,
        contact,
        date,
        age,
    });

    try {
        await appointment.save();
    } catch (err) {
        const error = new HttpError(
            'Creating appointment failed, please try again later.',
            500
        );
        return next(error);
    }
    res.status(201).json({ appointment: appointment.toObject({ getters: true }) });
};

const updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const {
            doctorId,
            userId,
            contact,
            gender,
            reason,
            status,
            date,
            name,
            age,
            time
        } = req.body;

        if (!time || !name || !contact || !gender || !reason || !status || !date || !age) {
            return res.status(400).json({ msg: "Please fill all the fields!" });
        }

        const existingAppointment = await Appointment.findById(appointmentId);

        if (!existingAppointment) {
            return res.status(404).json({ msg: "Appointment not found." });
        }
        const conflictingAppointment = await Appointment.findOne({
            _id: { $ne: appointmentId },
            doctorId,
            date,
            time
        });

        if (conflictingAppointment) {
            return res.status(400).json({ msg: "Doctor already has an appointment at the requested time." });
        }
        existingAppointment.doctorId = doctorId;
        existingAppointment.userId = userId;
        existingAppointment.contact = contact;
        existingAppointment.gender = gender;
        existingAppointment.reason = reason;
        existingAppointment.status = status;
        existingAppointment.date = date;
        existingAppointment.name = name;
        existingAppointment.age = age;
        existingAppointment.time = time;
        const updatedAppointment = await existingAppointment.save();

        res.json(updatedAppointment);
        console.log(updatedAppointment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.body.id;
        const {
            status,
        } = req.body;
        console.log(appointmentId);
        console.log(status);
        const existingAppointment = await Appointment.findById(appointmentId);
        existingAppointment.status = status;
        const updatedAppointment = await existingAppointment.save();
        console.log(updatedAppointment);

        res.json(updatedAppointment);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
};

const completeAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const {
            status,
        } = req.body;
        console.log(appointmentId);
        console.log(status);
        const existingAppointment = await Appointment.findById(appointmentId);
        existingAppointment.status = status;
        const updatedAppointment = await existingAppointment.save();
        console.log(updatedAppointment);

        res.json(updatedAppointment);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
};

const getSingleAppointment = async (req, res, next) => {
    try {
            const id = req.params.id;
            const filter = { _id: id };
            const appointment = await Appointment.findOne(filter);

            if (!appointment) {
                return res.status(404).json({ error: "Appointment not found" });
            }
            console.log(appointment);
            res.status(200).json(appointment);
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
};

exports.addAppointment = addAppointment;
exports.getAppointment = getAppointment;
exports.updateAppointment = updateAppointment;
exports.cancelAppointment = cancelAppointment;
exports.completeAppointment = completeAppointment;
exports.getSingleAppointment = getSingleAppointment;

