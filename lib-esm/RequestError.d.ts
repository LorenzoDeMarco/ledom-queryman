export interface IRequestError {
    message: string;
    position: number;
    errorCode?: number;
    errorRef?: string;
}
export default class RequestError implements IRequestError {
    position: number;
    message: string;
    errorCode?: number;
    errorRef?: string;
    constructor(message: string, error_code?: number, error_ref?: string);
}
