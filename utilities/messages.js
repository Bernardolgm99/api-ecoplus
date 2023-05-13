//200
exports.successOk = (object) => {
    return object
};

//201
exports.successCreated = (type, id) => {
    return { msg: `The ${type} ${id} was created!` }
};

//202
exports.successAccepted = () => {
    return { msg: 'Accepted' }
};

//400
exports.errorBadRequest = (messageType, variable, error) => {
    if (messageType == 0) return { success: false, msg: `${variable} must be a ${error}.` };
    else if (messageType == 1) return { success: false, msg: `Please provide a ${variable}.` };
    else if (messageType == 2) return { success: false, msg: `Please provide a valid ${variable}.` };
    else if (messageType == 3) return { success: false, msg: err.errors.map(e => e.message) };
};

//401
exports.errorUnathorized = () => {
    return { success: false, msg: `You are not authenticated!` };
};

//403
exports.errorForbidden = () => {
    return { success: false, msg: `You don't have permission to access!` };
};

//404
exports.errorNotFound = (variable) => {
    return { success: false, msg: `${variable} not founded!` };
};

//500
exports.errorInternalServerError = () => {
    return { success: false, msg: `Something went wrong. Please try again later!` };
};