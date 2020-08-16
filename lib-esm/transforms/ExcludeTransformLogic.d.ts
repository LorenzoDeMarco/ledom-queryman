import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
export default class ExcludeTransformLogic implements ITransformLogic {
    apply(context: RequestContext, args: any[], quota_cost?: number): void;
    private static applyExclude;
    private static applyExcludeBut;
    private static exclude;
    private static excludeAll;
}
