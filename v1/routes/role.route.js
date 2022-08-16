const express = require('express');
const router = express.Router();
const { validatorFunc } = require('../../helper/commonFunction.helper');
const { authenticate, routeOneAccess } = require('../../middleware/authenticate');
const { addRole_validator, deleteRole_validator, updateRole_validator } = require('../../validation/role.middleware');
const { addRole, getRoleList, updateRole, deleteRole } = require('../controllers/role.controller');

router.get('/', function (req, res, next) {
    res.send('Welcome to role route');;
});


router.post('/add', authenticate, addRole_validator, validatorFunc, addRole);
router.get('/list', getRoleList);
router.put('/update', authenticate, updateRole_validator, validatorFunc, updateRole);
router.delete('/delete', authenticate, deleteRole_validator, validatorFunc, deleteRole);

//Protected route  : to check whether or not particular user has access to particular module
router.get('/routeone', authenticate, routeOneAccess, getRoleList);

module.exports = router;
