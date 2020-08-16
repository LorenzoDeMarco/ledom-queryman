import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';
import { getValueByPath, setValueByPath } from '../util/ObjectPath';

export default class ReduceTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            switch (args.length) {
                case 1: // reduce <op>
                    ReduceTransformLogic.reduceOp(context, args);
                    break;
                case 2: // reduce <op> <fld>
                    ReduceTransformLogic.reduceOpFld(context, args);
                    break;
                case 3: // reduce <op> as <dst_fld>
                    ReduceTransformLogic.reduceOpAsFld(context, args);
                    break;
                case 4: // reduce <op> <src_fld> as <dst_fld>
                    ReduceTransformLogic.reduceOpFldAsFld(context, args);
                    break;
                default:
                    throw new RequestError("Invalid number of arguments.", 400);
            }
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute reduce", 500);
        }
    }

    private static numberize(value : any) {
        switch (typeof value) {
            case 'boolean':
                return value === true ? 1 : 0;
            case 'function':
                return ReduceTransformLogic.numberize(_.defaultTo(value(), 0));
            case 'object':
                throw new RequestError("Cannot reduce objects.", 400);
            case 'string':
                try {
                    let sn = Number(value);
                    return _.defaultTo(sn, value.length);
                } catch (error) {
                    throw new RequestError("Failed to reduce string.", 400);
                }
            case 'bigint':
            case 'number':
                return value;
            default:
                throw new RequestError("Failed to convert value to number.", 400);
        }
    }

    private static getReducer(op: string) {
        switch (op) {
            case 'sum':
            case 'avg':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return _.isNull(prev) || _.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev + curr;
                };
            case 'diff':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return _.isNull(prev) || _.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev - curr;
                };
            case 'mul':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return _.isNull(prev) || _.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev * curr;
                };
            case 'max':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return _.isNull(prev) || _.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : (curr >= prev ? curr : prev);
                };
            case 'min':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return _.isNull(prev) || _.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : (curr <= prev ? curr : prev);
                };
            default:
                throw new RequestError("Invalid operation.", 400);
        }
    }

    private static getReducerOn(op: string, fld: string) {
        return (prev, curr) => {
            let prev_val = prev;
            if (typeof prev === 'object') {
                prev_val = getValueByPath(prev, fld);
                if (!prev_val.found)
                    throw new RequestError("Source property not found on one or more objects.", 400);
                prev_val = prev_val.value;
            }
            let curr_val = prev;
            if (typeof curr === 'object') {
                curr_val = getValueByPath(curr, fld);
                if (!curr_val.found)
                    throw new RequestError("Source property not found on one or more objects.", 400);
                curr_val = curr_val.value;
            }
            const reducer = ReduceTransformLogic.getReducer(op);
            return reducer(prev_val, curr_val);
        };
    }

    private static getInitial(op: string) : any {
        switch (op) {
            case 'sum':
            case 'diff':
            case 'avg':
            default:
                return 0;
            case 'mul':
                return 1;
            case 'max':
                return Infinity * -1;
            case 'min':
                return Infinity;
        }
    }

    private static postProcess(op: string, value: any, items_cnt: number) : any {
        switch (op) {
            case 'sum':
            case 'diff':
            case 'mul':
            case 'max':
            case 'min':
                return value;
            case 'avg':
                return items_cnt > 0 ? value / items_cnt : 0;
        }
    }

    private static reduceOp(context: RequestContext, args: any[]) {
        let op = args[0];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError("Invalid operation.", 400);
        let arr: Array<any> = _.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducer(op), ReduceTransformLogic.getInitial(op)), arr.length);
        context.pushEntity(result);
    }

    private static reduceOpFld(context: RequestContext, args: any[]) {
        let op = args[0];
        let src_fld = args[1];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError("Invalid operation.", 400);
        if (!src_fld || typeof src_fld != 'string' || src_fld.length === 0)
            throw new RequestError("Invalid source property.", 400);
        let arr: Array<any> = _.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducerOn(op, src_fld), ReduceTransformLogic.getInitial(op)), arr.length);
        context.pushEntity(result);
    }

    private static reduceOpAsFld(context: RequestContext, args: any[]) {
        let op = args[0];
        if (args[1] !== 'as')
            throw new RequestError("Expected 'as'.", 400);
        let dst_fld = args[2];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError("Invalid operation.", 400);
        if (!dst_fld || typeof dst_fld != 'string' || dst_fld.length === 0)
            throw new RequestError("Invalid destination property.", 400);
        let arr: Array<any> = _.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducer(op), ReduceTransformLogic.getInitial(op)), arr.length);
        let tmp = {};
        setValueByPath(tmp, dst_fld, result);
        context.pushEntity(tmp);
    }

    private static reduceOpFldAsFld(context: RequestContext, args: any[]) {
        let op = args[0];
        let src_fld = args[1];
        if (args[2] !== 'as')
            throw new RequestError("Expected 'as'.", 400);
        let dst_fld = args[3];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError("Invalid operation.", 400);
        if (!src_fld || typeof src_fld != 'string' || src_fld.length === 0)
            throw new RequestError("Invalid source property.", 400);
        if (!dst_fld || typeof dst_fld != 'string' || dst_fld.length === 0)
            throw new RequestError("Invalid destination property.", 400);
        let arr: Array<any> = _.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducerOn(op, src_fld), ReduceTransformLogic.getInitial(op)), arr.length);
        let tmp = {};
        setValueByPath(tmp, dst_fld, result);
        context.pushEntity(tmp);
    }
}
