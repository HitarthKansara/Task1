module.exports = {
    AUTH_TOKEN_EXPIRE_TIME: '14d',
    REFRESH_TOKEN_EXPIRE_TIME: '14d',
    JWT_EXPIRED_MESSAGE: 'jwt expired',

    PAGE: 1,
    LIMIT: 10,

    STATUS_CODE: {
        SUCCESS: 1,
        FAIL: 0,
        VALIDATION: 2,
        UNAUTHENTICATED: -1,
        NOT_FOUND: -2,
        SEE_OTHER: -3
    },

    WEB_STATUS_CODE: {
        OK: 200,
        CREATED: 201,
        NO_DATA: 203,
        NO_CONTENT: 204,
        SEE_OTHER: 303,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        SERVER_ERROR: 500,
        FORBIDDEN: 403
    },

    STATUS: {
        ACTIVE: true,
        INACTIVE: false
    },

}