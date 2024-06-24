const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    linkedin: { type: String },
    twitter: { type: String }
});

const Contact = mongoose.model('Contact', contactSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = { Contact, User };
