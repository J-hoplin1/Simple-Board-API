const { User } = require('../models');
const {
    commonMessage
} = require('../util');
const Codes = require('../Codes');

exports.apiBlocked = (req, res) => {
    return res.status(Codes.FORBIDDEN_API.code).json(
        commonMessage(Codes.FORBIDDEN_API.message)
    );
};

exports.deprecated = (req, res) => {
    return res.status(Codes.DEPRECATED_API.code).json(
        commonMessage(Codes.DEPRECATED_API.message)
    );
};

exports.blockInProduction = (req, res, next) => {
    if (process.env.MODE === 'development') {
        return next();
    }
    return res.status(Codes.ONLY_AVAILABLE_IN_DEVELOPMENT.code).json(
        commonMessage(Codes.ONLY_AVAILABLE_IN_DEVELOPMENT.message)
    );
};

// This should be after verifytoken
exports.checkUserRole = (roles) => {
    return async (req, res, next) => {
        // req.decoded will be added from verifyJWT middleware 
        const {
            id
        } = req.decoded;
        const user = await User.findOne({
            attributes: ["role"],
            raw: true,
            where: {
                id
            }
        });
        if (!user) {
            return res.status(Codes.USER_NOT_EXIST.code).json(
                commonMessage(Codes.USER_NOT_EXIST.message)
            );
        }
        if (!roles.includes(user.role)) {
            return res.status(Codes.FORBIDDEN_API.code).json(
                commonMessage(Codes.FORBIDDEN_API.message)
            );
        }
        next();
    };
};

exports.embedPostID = (req, res, next) => {
    const {
        id
    } = req.params;
    // If id null
    if (!id) {
        return res.status(Codes.POST_ID_NOT_GIVEN.code).json(
            commonMessage(Codes.POST_ID_NOT_GIVEN.message)
        );
    }
    req.postId = id;
    next();
};