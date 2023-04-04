// Validation functions
// Checks the validity of the names given to
// classes, methods, parameters, properties etc
function checkNameValidity(name) {
    return /^[A-Za-z][A-Za-z0-9_]*$/.test(name);
}

// C++ access modifiers
const accessModifiers = {
    public: "public",
    protected: "protected",
    private: "private",
}

// Focuses on a temporary element, useful to unfocus any currently focused element
function loseFocus() {
    const tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}

export { checkNameValidity, accessModifiers, loseFocus };