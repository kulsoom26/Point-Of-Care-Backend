const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: true },
    age: { type: Number, required: true },
    userName: {type: String, required: true},
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Patient', patientSchema);
