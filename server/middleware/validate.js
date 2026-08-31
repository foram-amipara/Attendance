const { signupSchema, loginSchema  } = require("../validators/userSchema");
const ExpressError = require("../utils/ExpressError.js");
const { subjectSchema } = require("../validators/subjectSchema");
const { attendanceSchema } = require("../validators/attendanceSchema");

module.exports.validateSignup = (req, res, next) => {
    let { error } = signupSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.validateLogin = (req, res, next) => {
    let { error } = loginSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.validateSubject = (req, res, next) => {
    const { error } = subjectSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};


module.exports.validateAttendance = (req, res, next) => {
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};