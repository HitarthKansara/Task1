const { body } = require('express-validator')

exports.login_validator = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.EMAIL_REQUIRED')
        .isEmail()
        .withMessage('USER_VALIDATION.EMAIL_VALID')
        .trim(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.PASSWORD_REQUIRED')
        .trim()
];

exports.signUp_validator = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.EMAIL_REQUIRED')
        .isEmail()
        .withMessage('USER_VALIDATION.EMAIL_VALID')
        .trim(),
    body('first_name')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.FIRST_NAME_REQUIRED')
        .isString()
        .withMessage('USER_VALIDATION.FIRST_NAME_VALID')
        .trim(),
    body('last_name')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.LAST_NAME_REQUIRED')
        .isString()
        .withMessage('USER_VALIDATION.LAST_NAME_VALID')
        .trim(),
    body('role')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.ROLE_ID_REQUIRED')
        .isMongoId()
        .withMessage('USER_VALIDATION.VALID_ID')
        .trim(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.PASSWORD_REQUIRED')
        .isLength({ min: 6 })
        .withMessage('USER_VALIDATION.PASSWORD_SIZE')
        .trim()
];

exports.updateSameData_validator = [
    body('field')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.FIELD_REQUIRED')
        .trim(),
    body('value')
        .not()
        .isEmpty()
        .withMessage('USER_VALIDATION.VALUE_REQUIRED')
        .trim()
];
