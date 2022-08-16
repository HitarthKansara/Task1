const express = require('express');
const router = express.Router();
const { validatorFunc } = require('../../helper/commonFunction.helper');
const { authenticate } = require('../../middleware/authenticate');
const { login_validator, signUp_validator, updateSameData_validator } = require('../../validation/user.middleware')

const {
    login,
    getProfile,
    getUserList,
    signUp,
    updateSameData,
    updateDifferentData
} = require('../controllers/users.controller');

router.get('/', function (req, res, next) {
    res.send('Welcome to user route');;
});


router.post('/login', login_validator, validatorFunc, login);
router.post('/sign-up', signUp_validator, validatorFunc, signUp);
router.get('/list', authenticate, getUserList);
router.get('/profile', authenticate, getProfile);
router.put('/update-same-data', authenticate, updateSameData_validator, validatorFunc, updateSameData);
router.put('/update-different-data', authenticate, updateDifferentData);

module.exports = router;
