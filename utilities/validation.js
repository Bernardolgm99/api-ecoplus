exports.validationImage = (file) => {
    const validImageType = ["image/gif", "image/jpeg", "image/png"];
    const fileType = file['type'];

    if (validImageType.includes(fileType)) return true;
    return false;
}

exports.validationDate = (object) => {
    return object instanceof Date;
}

exports.validationDates = (start, end) => {
    const date = new Date();
    const todayDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
    if(start < todayDate || start > end || end < todayDate)
        return false;
    else return true;
}

exports.validationFiles = (files) => {
    for (file of files) {
        if (!(file instanceof File)) return false;
    };
    return true;
};
