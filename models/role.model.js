const mongoose = require('mongoose');
const constants = require('../config/constants');
const dateFormat = require('../helper/dateformat.helper');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    access_modules: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    createdAt: {
        type: Number,
        default: dateFormat.setCurrentTimestamp()
    },
    active: {
        type: Boolean,
        default: constants.STATUS.ACTIVE
    }
});

const Role = mongoose.model('roles', roleSchema);
module.exports = Role;