const User = require('../../models/user.model');
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongoose').Types;

const { sendResponse, capitalizeFirstLetter } = require('../../services/common.service');
const constants = require('../../config/constants');

const getUserList = async (req, res, next) => {
    try {

        let {
            limit,
            page,
            sortBy,
            search
        } = req.query

        limit = +limit || constants.LIMIT
        page = +page || constants.PAGE

        let field = 'createdAt', value = 1;
        if (sortBy) {
            const parts = sortBy.split(':');
            field = parts[0];
            parts[1] === 'desc' ? value = -1 : value = 1;
        }

        let query = {};

        if (search) {
            query.$or = [
                { 'email': new RegExp(search, 'i') },
                { 'first_name': new RegExp(search, 'i') },
                { 'last_name': new RegExp(search, 'i') }
            ]
        }

        const totalUsers = await User.count(query);

        if (totalUsers == 0) {
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.SUCCESS, 'USER.USER_DETAILS_NOT_AVAILABLE', null, req.headers.lang);
        }

        let usersList = await User.find(query, '_id first_name last_name email role createdAt')
            .populate({ path: 'role', select: 'name access_modules' })
            .sort({ [field]: value })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        usersList.map(x => {
            x.role_details = { ...x.role };
            delete x.role;
        })

        let dataObj = {
            data: usersList,
            total: totalUsers,
            limit,
            page,
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.GET_USER_LIST', dataObj, req.headers.lang, null);
    } catch (err) {
        console.log('Error(getUserList): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang, null);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (user == 1) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.USER_NOT_FOUND', null, req.headers.lang);
        if (user == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.INVALID_PASSWORD', null, req.headers.lang);
        if (user.active === constants.STATUS.INACTIVE) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.DEACTIVE_ACCOUNT', null, req.headers.lang);

        if (!user) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.UNAUTHORIZED_USER', null, req.headers.lang)

        await user.generateAuthToken();
        await user.generateRefreshToken();

        await user.save();
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.LOGIN_SUCCESS', user, req.headers.lang, req.headers.lang);
    } catch (err) {
        console.log('Error(login): ', err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const signUp = async (req, res, next) => {
    try {
        const reqBody = req.body;

        reqBody.password = await bcrypt.hash(reqBody.password, 10);

        let isExists = await User.findOne({ email: reqBody.email });
        if (isExists) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.ALREADY_EXIST', null, req.headers.lang);
        }

        let user = new User(reqBody);
        await user.generateAuthToken();
        await user.generateRefreshToken();
        
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.LOGIN_SUCCESS', user, req.headers.lang, req.headers.lang);
    } catch (err) {
        console.log('Error(signUp): ', err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const getProfile = async (req, res, next) => {
    try {
        let userData = await User.findById(req.user._id).select('email first_name last_name ').lean();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.GET_USER_PROFILE', userData, req.headers.lang);
    } catch (err) {
        console.log("Error(getProfile): ", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const updateSameData = async (req, res, next) => {
    try {
        let reqBody = req.body;
        let { field, value } = reqBody;

        await User.updateMany({}, { $set: { [field]: value } });

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.UPDATE_SUCCESS', null, req.headers.lang);
    } catch (err) {
        console.log("Error(updateSameData): ", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const updateDifferentData = async (req, res, next) => {
    try {
        let reqBody = req.body;

        for (let i = 0; i < reqBody.length; i++) {

            let { field, value } = reqBody[i];

            await User.updateMany(
                { _id: ObjectId(reqBody[i]['_id']) },
                {
                    $set: { [field]: value }
                });
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.UPDATE_SUCCESS', null, req.headers.lang);
    } catch (err) {
        console.log("Error(updateDifferentData): ", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

module.exports = {
    getUserList,
    login,
    getProfile,
    signUp,
    updateSameData,
    updateDifferentData
}