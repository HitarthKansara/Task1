const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const constants = require('../config/constants');
const dateFormat = require('../helper/dateformat.helper');
const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'roles'
    },
    auth_tokens: {
        type: String,
    },
    token_expires_at: {
        type: Number
    },
    refresh_tokens: {
        type: String
    },
    createdAt: {
        type: Number,
        default: dateFormat.setCurrentTimestamp()
    },
    active: {
        type: Boolean,
        default: constants.STATUS.ACTIVE
    }
});

//Checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//Output data to JSON
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return userObject;
};

//Checking for user credentials
userSchema.statics.findByCredentials = async function (email, password) {

    const user = await Users.findOne({ email: email, active: true });

    if (!user)
        return 1

    if (!user.validPassword(password))
        return 2

    return user;
}

//Generating auth token
userSchema.methods.generateAuthToken = async function () {
    let user = this;
    let token = jwt.sign({
        _id: user._id.toString(),
        email: user.email,
        role: user.role
    }, JWT_AUTH_SECRET, {
        expiresIn: constants.AUTH_TOKEN_EXPIRE_TIME
    })
    const token_expires_at = dateFormat.addTimeToCurrentTimestamp(1, 'days');

    let authTokenObj = { token, token_expires_at };

    user.auth_tokens = authTokenObj.token;
    user.token_expires_at = authTokenObj.token_expires_at;

    await user.save();

    return authTokenObj;
}

userSchema.methods.generateRefreshToken = async function () {
    let user = this;
    let refresh_tokens = jwt.sign({
        _id: user._id.toString()
    }, JWT_REFRESH_SECRET, {
        expiresIn: constants.REFRESH_TOKEN_EXPIRE_TIME
    })
    user.refresh_tokens = refresh_tokens
    await user.save()
    return refresh_tokens;
}

userSchema.pre('save', function (next) {
    if (!this.createdAt) this.createdAt = dateFormat.setCurrentTimestamp();
    next();
});

const Users = mongoose.model('users', userSchema);
module.exports = Users;