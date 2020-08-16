export default interface IResponse {
    isError: boolean;
    errorPosition?: number;
    errorCode?: number;
    errorText?: string;
    errorRef?: string;

    data?: any;
    remainingQuota?: number;
}

export function errorResponse(error_code: number, error_text: string = '', ref: string = '') : IResponse {
    return {
        isError: true,
        errorPosition: 0,
        errorCode: error_code,
        errorText: error_text,
        errorRef: ref
    };
}

export function dataResponse(data: any) : IResponse {
    return {
        isError: false,
        data: data
    };
}