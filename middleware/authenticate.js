const User = require('../models/user.model');
const Role = require('../models/role.model');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const { sendResponse } = require('../services/common.service');
const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET;

// authenticate user
let authenticate = async (req, res, next) => {
    try {

        if (!req.header('Authorization')) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.UNAUTHORIZED_USER', null, req.headers.lang);

        const token = req.header('Authorization')?.toString().replace('Bearer ', '');
        if (!token) sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.NOT_TOKEN', null, req.headers.lang)

        const decoded = jwt.verify(token, JWT_AUTH_SECRET);

        console.log('decoded--->', decoded);
        const user = await User.findOne({ _id: decoded._id, 'auth_tokens': token, }).lean();

        if (!user) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.UNAUTHORIZED_USER', null, req.headers.lang);
        if (user.active !== constants.STATUS.ACTIVE) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'USER.DEACTIVE_ACCOUNT', null, req.headers.lang);

        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        console.log('Error(authenticate): ', err);

        if (err.message == constants.JWT_EXPIRED_MESSAGE) {
            return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.JWT_EXPIRED', null, req.headers.lang);
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const routeOneAccess = async (req, res, next) => {
    try {
        // allow route one user access-rights
        let { access_modules } = await Role.findOne({ _id: req.user.role }, { 'access_modules': 1 }).lean();
        console.log('access_modules--->', access_modules);
        console.log('--->', access_modules.includes('routeOne'));
        if (access_modules.includes('routeOne')) {
            next();
        } else {
            return sendResponse(res, constants.WEB_STATUS_CODE.FORBIDDEN, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.RESTRICTED_USER', null, req.headers.lang)
        }
    } catch (err) {
        console.log('Error(routeOneAccess): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}


module.exports = { authenticate, routeOneAccess };