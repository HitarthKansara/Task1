const fs = require('fs');

const moment = require('moment');
const constants = require('../config/constants');

const sendResponse = (res, statusCode, status, message, data, lang = 'en', replaceObj = {}) => {
    try {
        statusCode = +statusCode;

        const msg = require(`../message/message`);

        let obj = message.split('.');
        keyName = obj[0];
        subKey = obj[1];

        let resMessage = msg[keyName][subKey];

        if (replaceObj && Object.keys(replaceObj).length !== 0) {
            resMessage = replaceString(resMessage, replaceObj)
        }

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({
            status: status,
            message: resMessage,
            data: (statusCode === 500) ? data.message : data
        }));
        res.end();
    } catch (err) {
        console.log('Error(sendResponse): ', err);
        throw err
    }
}

const responseIn = function (message, lang = 'en') {
    try {

        const msg = require(`../message/validationMessage`);

        let obj = message.split('.');
        keyName = obj[0];
        subKey = obj[1];

        return msg[keyName][subKey];
    } catch (err) {
        console.log('Error(responseIn): ', err);
        throw err
    }
}

const sendResponseValidation = (res, statusCode, status, message, data, lang = 'en', replaceObj = {}) => {
    try {

        const msg = require(`../message/validationMessage`);

        let obj = message.split('.');
        keyName = obj[0];
        subKey = obj[1];

        let resMessage = msg[keyName][subKey];

        if (Object.keys(replaceObj).length !== 0) {
            resMessage = replaceString(resMessage, replaceObj)
        }

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({
            status: status,
            message: resMessage,
            data: data
        }));
        res.end();
    } catch (err) {
        console.log('Error(sendResponseValidation): ', err);
        throw err
    }
}

const replaceString = (str, replaceObject) => {
    for (keys in replaceObject) {
        str = str.replace(keys, replaceObject[keys])
    }
    return str;
}

const passwordGenerator = (len) => {
    let length = (len) ? (len) : (10);
    let string = 'abcdefghijklmnopqrstuvwxyz'; //to upper 
    let numeric = '0123456789';
    let punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let password = '';
    let character = '';
    while (password.length < length) {
        entity1 = Math.ceil(string.length * Math.random() * Math.random());
        entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
        hold = string.charAt(entity1);
        hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        character += punctuation.charAt(entity3);
        password = character;
    }
    password = password.split('').sort(function () { return 0.5 - Math.random() }).join('');
    if (Keys.ENV == 'production') {
        return password.substring(0, len);
    } else {
        return "Inx@!123";
    }

}

const capitalizeFirstLetter = (string) => {
    string = string.toLowerCase();
    const words = string.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
};

const capitalizeFirstLetterUsingRegex = (string) => {
    string = string.toLowerCase();
    return string.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
};

const getFullName = (userData) => {
    return `${userData?.first_name} ${userData?.last_name}`;
}

module.exports = {
    sendResponse,
    responseIn,
    sendResponseValidation,
    passwordGenerator,
    capitalizeFirstLetter,
    capitalizeFirstLetterUsingRegex,
    getFullName,
}