const express = require('express');
const router = express.Router();
const userRoute = require('./users.route');
const roleRoute = require('./role.route');

router.use('/users', userRoute);
router.use('/role', roleRoute);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({ message: 'Task 1' });
});


module.exports = router;
