// Validation functions
// Checks the validity of the names given to
// classes, methods, parameters, properties etc
function checkNameValidity(name) {
    return /^[A-Za-z][A-Za-z0-9_]*$/.test(name);
}

export { checkNameValidity };