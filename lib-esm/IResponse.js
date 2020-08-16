export function errorResponse(error_code, error_text = '', ref = '') {
    return {
        isError: true,
        errorPosition: 0,
        errorCode: error_code,
        errorText: error_text,
        errorRef: ref
    };
}
export function dataResponse(data) {
    return {
        isError: false,
        data: data
    };
}
//# sourceMappingURL=IResponse.js.map