import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
export default class PushvTransformLogic implements ITransformLogic {
    apply(context: RequestContext, args: any[], quota_cost?: number): void;
}
