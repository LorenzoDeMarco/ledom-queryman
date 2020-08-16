import RequestContext from './RequestContext';
export default interface ITransformLogic {
    apply(context: RequestContext, args?: any[], quota_cost?: number): any;
}
