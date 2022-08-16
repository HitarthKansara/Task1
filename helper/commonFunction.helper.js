const { validationResult } = require('express-validator');

const { sendResponseValidation } = require('../services/common.service');

const constants = require('../config/constants');


// show validation error message
const validatorFunc = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponseValidation(
            res,
            constants.WEB_STATUS_CODE.BAD_REQUEST,
            constants.STATUS_CODE.VALIDATION,
            errors.array()[0].msg,
            {},
            req.headers.lang,
            {}
        );
    }
    next();
};

module.exports = { validatorFunc }