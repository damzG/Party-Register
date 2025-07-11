const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    type: { type: String, enum: ['single', 'couple'], required: true },
    names: [String]
});

module.exports = mongoose.model('Person', personSchema);
