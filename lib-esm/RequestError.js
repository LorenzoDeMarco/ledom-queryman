export default class RequestError {
    constructor(message, error_code, error_ref) {
        this.position = 0;
        this.message = message;
        if (error_code)
            this.errorCode = error_code;
        if (error_ref)
            this.errorRef = error_ref;
    }
}
//# sourceMappingURL=RequestError.js.map