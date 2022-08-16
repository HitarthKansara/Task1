const Role = require('../../models/role.model');
const constants = require('../../config/constants');

const { sendResponse } = require('../../services/common.service');

const addRole = async (req, res) => {
    try {
        let reqBody = req.body;

        let isExists = await Role.findOne({ name: { $regex: '^' + reqBody.name + '$', $options: 'i' } }).lean();
        if (isExists) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ROLE.ALREADY_EXISTS', null, req.headers.lang);
        }

        let accessModulesLength = [...new Set(reqBody?.access_modules)]?.length;
        let isExistingAccessModule = await Role.findOne({ 'access_modules': { $in: reqBody.access_modules } }, { 'access_modules': 1 }).lean();

        if (reqBody?.access_modules?.length !== accessModulesLength || isExistingAccessModule) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ROLE.UNIQUE_ACCESS_MODULES', null, req.headers.lang);
        }

        let role = new Role(reqBody);
        let roleData = await role.save();
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ROLE.CREATED', roleData, req.headers.lang);
    } catch (err) {
        console.log('Error(addRole): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const updateRole = async (req, res) => {
    try {
        let reqBody = req.body;

        let isExists = await Role.findOne({ _id: { $ne: reqBody._id }, name: { $regex: '^' + reqBody.name + '$', $options: 'i' } }).lean();
        if (isExists) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ROLE.ALREADY_EXISTS', userData, req.headers.lang);
        }

        let role = await Role.findOne({ _id: reqBody._id });
        let oldData = [];
        reqBody.access_modules.filter(x => {
            let isMatchedAccessRoute = role.access_modules.find(y => y.toString() === x.toString());
            isMatchedAccessRoute && oldData.push(isMatchedAccessRoute);
            return x;
        });

        //Remove only one value from access modules else show warning
        if (role?.access_modules?.length - oldData.length > 1) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ROLE.REMOVE_ONE_ACCESS_MODULE_PER_UPDATE', null, req.headers.lang);
        }

        let query = { _id: { $ne: reqBody._id }, 'access_modules': { $in: [...reqBody.access_modules] } };

        let roleDetails = await Role.findOne(query, 'access_modules').lean();

        let accessModulesLength = [...new Set(reqBody.access_modules)].length;

        //Inserts only unique values in access modules else show warning
        if (reqBody.access_modules.length !== accessModulesLength || roleDetails?.access_modules.length) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ROLE.UNIQUE_ACCESS_MODULES', null, req.headers.lang);
        }

        let roleData = await Role.findByIdAndUpdate({ _id: reqBody._id }, { $set: reqBody }, { new: true });
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ROLE.UPDATE', roleData, req.headers.lang);
    } catch (err) {
        console.log('Error(updateRole): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

const getRoleList = async (req, res, next) => {
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

        if (search) {
            query.$or = [
                { 'email': new RegExp(search, 'i') },
                { 'first_name': new RegExp(search, 'i') },
                { 'last_name': new RegExp(search, 'i') }
            ]
        }

        const totalRoles = await Role.count({});

        if (totalRoles == 0) {
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.SUCCESS, 'ROLE.LIST_NOT_FOUND', null, req.headers.lang);
        }

        let roleList = await Role.find().sort({ [field]: value }).skip((page - 1) * limit).limit(limit).lean();

        let dataObj = {
            data: roleList,
            total: totalRoles,
            limit,
            page,
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ROLE.GET_LIST', dataObj, req.headers.lang, null);
    } catch (err) {
        console.log('Error(getRoleList): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang, null);
    }
}

const deleteRole = async (req, res) => {
    try {
        let reqBody = req.body;

        let roleData = await Role.findByIdAndDelete({ _id: reqBody._id });
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ROLE.DELETED', roleData, req.headers.lang);
    } catch (err) {
        console.log('Error(deleteRole): ', err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.GENERAL_ERROR_CONTENT', err, req.headers.lang)
    }
}

module.exports = { addRole, updateRole, getRoleList, deleteRole }