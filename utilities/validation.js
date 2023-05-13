exports.validationImage = (file) => {
    const validImageType = ["image/gif", "image/jpeg", "image/png"];
    const fileType = file['type'];

    if (validImageType.includes(fileType)) return true;
    return false;
}

exports.validationDate = (object) => {
    return object instanceof Date;
}

exports.validationFiles = (files) => {
    for (file of files) {
        if (!(file instanceof File)) return false;
    };
    return true;
};