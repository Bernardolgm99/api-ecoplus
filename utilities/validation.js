exports.validationImage = (file) => {
    const validImageType = ["image/gif", "image/jpeg", "image/png"];
    const fileType = file['type'];

    if(validImageType.includes(fileType)) return true;
    return false;
}
