exports.authenticate = (req, res, next) => {
    console.log(`The user with token ${"TOKEN"} is authenticated for this action!`)
    next();
};

exports.validationImage = (file) => {
    const validImageType = ["image/gif", "image/jpeg", "image/png"];
    const fileType = file['type'];

    if(validImageType.includes(fileType)) return true;
    return false;
}
