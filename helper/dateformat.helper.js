const moment = require('moment');

//set current timestamp
exports.setCurrentTimestamp = function () {
    return moment().format('X');
}

exports.addTimeToCurrentTimestamp = function (number, timeformat) {
    return moment().add(number, timeformat).format('X');
}

exports.subtractTimeToCurrentTimestamp = function (number, timeformat) {
    return moment().subtract(number, timeformat).format('X');
}

//add time to current timestamp
exports.addTimeToDate = function (date, number, timeformat) {
    return moment(date).utc().add(number, timeformat);
}

// current time based on timezone
exports.getUTCTime = () => {
    return moment.utc();
}

//function to get date/month/year from timestamp
exports.getMDYFromTimeStamp = (timestamp, options = 'date') => {
    let response;
    if (timestamp === null || timestamp === undefined) {
        timestamp = moment().format('X');
    }
    if (options === 'date') {
        response = moment(timestamp * 1000).date();
    } else if (options === 'month') {
        response = moment(timestamp * 1000).month() + 1;
    } else if (options === 'year') {
        response = moment(timestamp * 1000).year();
    }

    return response;
}

//Get start time stamp
exports.getStartTimestampOf = (dt, format, unit) => {
    return Number(moment(dt, format).startOf(unit).format('X'));
}

//Get end time stamp
exports.getEndTimestampOf = (dt, format, unit) => {
    return Number(moment(dt, format).endOf(unit).format('X'));
}