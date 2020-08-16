"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataResponse = exports.errorResponse = void 0;
function errorResponse(error_code, error_text = '', ref = '') {
    return {
        isError: true,
        errorPosition: 0,
        errorCode: error_code,
        errorText: error_text,
        errorRef: ref
    };
}
exports.errorResponse = errorResponse;
function dataResponse(data) {
    return {
        isError: false,
        data: data
    };
}
exports.dataResponse = dataResponse;
//# sourceMappingURL=IResponse.js.map