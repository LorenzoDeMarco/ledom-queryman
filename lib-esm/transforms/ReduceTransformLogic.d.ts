import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
export default class ReduceTransformLogic implements ITransformLogic {
    apply(context: RequestContext, args: any[], quota_cost?: number): void;
    private static numberize;
    private static getReducer;
    private static getReducerOn;
    private static getInitial;
    private static postProcess;
    private static reduceOp;
    private static reduceOpFld;
    private static reduceOpAsFld;
    private static reduceOpFldAsFld;
}
