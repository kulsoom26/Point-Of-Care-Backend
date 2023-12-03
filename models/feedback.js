const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const feedbackSchema = mongoose.Schema({
    feedback: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

feedbackSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Feedback', feedbackSchema);