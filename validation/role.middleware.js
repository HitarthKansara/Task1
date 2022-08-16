const { body } = require('express-validator')

exports.addRole_validator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('ROLE_VALIDATION.NAME_REQUIRED')
        .trim(),
    body('access_modules')
        .not()
        .isEmpty()
        .withMessage('ROLE_VALIDATION.ACCESS_MODULES_REQUIRED')
        .isArray()
        .withMessage('GENERAL.ARRAY_ONLY'),
];

exports.updateRole_validator = [
    body('_id')
        .not()
        .isEmpty()
        .withMessage('GENERAL.ID_REQUIRED')
        .isMongoId()
        .withMessage('GENERAL.VALID_ID')
        .trim(),
    body('name')
        .not()
        .isEmpty()
        .withMessage('ROLE_VALIDATION.NAME_REQUIRED')
        .trim(),
    body('access_modules')
        .not()
        .isEmpty()
        .withMessage('ROLE_VALIDATION.ACCESS_MODULES_REQUIRED')
        .isArray()
        .withMessage('GENERAL.ARRAY_ONLY')
];

exports.deleteRole_validator = [
    body('_id')
        .not()
        .isEmpty()
        .withMessage('GENERAL.ID_REQUIRED')
        .isMongoId()
        .withMessage('GENERAL.VALID_ID')
        .trim()
];
