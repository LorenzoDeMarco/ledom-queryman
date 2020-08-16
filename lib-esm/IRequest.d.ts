import { IRequestTransform } from './IRequestTransform';
export default interface IRequest {
    query?: Array<string | IRequestTransform>;
}
