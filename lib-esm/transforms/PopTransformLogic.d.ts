import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
export default class PopTransformLogic implements ITransformLogic {
    apply(context: RequestContext, args: any[], quota_cost?: number): void;
}
