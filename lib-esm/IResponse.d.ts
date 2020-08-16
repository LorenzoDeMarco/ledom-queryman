export default interface IResponse {
    isError: boolean;
    errorPosition?: number;
    errorCode?: number;
    errorText?: string;
    errorRef?: string;
    data?: any;
    remainingQuota?: number;
}
export declare function errorResponse(error_code: number, error_text?: string, ref?: string): IResponse;
export declare function dataResponse(data: any): IResponse;
