import { IRequestTransform } from './IRequestTransform';

// Defines an external request.
export default interface IRequest {
    query?: Array<string | IRequestTransform>;
}