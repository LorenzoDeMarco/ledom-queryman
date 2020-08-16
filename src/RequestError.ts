export interface IRequestError {
    message: string;

    position: number;
    errorCode?: number;
    errorRef?: string;
}

export default class RequestError implements IRequestError {
    public position: number;
    public message: string;
    public errorCode?: number;
    public errorRef?: string;
    
    constructor(message: string, error_code?: number, error_ref?: string) {
        this.position = 0;
        this.message = message;
        if (error_code) this.errorCode = error_code;
        if (error_ref) this.errorRef = error_ref;
    }
}