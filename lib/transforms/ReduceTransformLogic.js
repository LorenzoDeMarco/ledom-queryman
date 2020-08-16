"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const ObjectPath_1 = require("../util/ObjectPath");
class ReduceTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (!lodash_1.default.isArray(context.getCurrentEntity()))
                throw new RequestError_1.default("Not an array", 400);
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
                    throw new RequestError_1.default("Invalid number of arguments.", 400);
            }
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute reduce", 500);
        }
    }
    static numberize(value) {
        switch (typeof value) {
            case 'boolean':
                return value === true ? 1 : 0;
            case 'function':
                return ReduceTransformLogic.numberize(lodash_1.default.defaultTo(value(), 0));
            case 'object':
                throw new RequestError_1.default("Cannot reduce objects.", 400);
            case 'string':
                try {
                    let sn = Number(value);
                    return lodash_1.default.defaultTo(sn, value.length);
                }
                catch (error) {
                    throw new RequestError_1.default("Failed to reduce string.", 400);
                }
            case 'bigint':
            case 'number':
                return value;
            default:
                throw new RequestError_1.default("Failed to convert value to number.", 400);
        }
    }
    static getReducer(op) {
        switch (op) {
            case 'sum':
            case 'avg':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return lodash_1.default.isNull(prev) || lodash_1.default.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev + curr;
                };
            case 'diff':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return lodash_1.default.isNull(prev) || lodash_1.default.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev - curr;
                };
            case 'mul':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return lodash_1.default.isNull(prev) || lodash_1.default.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : prev * curr;
                };
            case 'max':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return lodash_1.default.isNull(prev) || lodash_1.default.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : (curr >= prev ? curr : prev);
                };
            case 'min':
                return (prev, curr) => {
                    prev = ReduceTransformLogic.numberize(prev);
                    curr = ReduceTransformLogic.numberize(curr);
                    return lodash_1.default.isNull(prev) || lodash_1.default.isUndefined(prev) ? ReduceTransformLogic.getInitial(op) : (curr <= prev ? curr : prev);
                };
            default:
                throw new RequestError_1.default("Invalid operation.", 400);
        }
    }
    static getReducerOn(op, fld) {
        return (prev, curr) => {
            let prev_val = prev;
            if (typeof prev === 'object') {
                prev_val = ObjectPath_1.getValueByPath(prev, fld);
                if (!prev_val.found)
                    throw new RequestError_1.default("Source property not found on one or more objects.", 400);
                prev_val = prev_val.value;
            }
            let curr_val = prev;
            if (typeof curr === 'object') {
                curr_val = ObjectPath_1.getValueByPath(curr, fld);
                if (!curr_val.found)
                    throw new RequestError_1.default("Source property not found on one or more objects.", 400);
                curr_val = curr_val.value;
            }
            const reducer = ReduceTransformLogic.getReducer(op);
            return reducer(prev_val, curr_val);
        };
    }
    static getInitial(op) {
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
    static postProcess(op, value, items_cnt) {
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
    static reduceOp(context, args) {
        let op = args[0];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError_1.default("Invalid operation.", 400);
        let arr = lodash_1.default.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducer(op), ReduceTransformLogic.getInitial(op)), arr.length);
        context.pushEntity(result);
    }
    static reduceOpFld(context, args) {
        let op = args[0];
        let src_fld = args[1];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError_1.default("Invalid operation.", 400);
        if (!src_fld || typeof src_fld != 'string' || src_fld.length === 0)
            throw new RequestError_1.default("Invalid source property.", 400);
        let arr = lodash_1.default.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducerOn(op, src_fld), ReduceTransformLogic.getInitial(op)), arr.length);
        context.pushEntity(result);
    }
    static reduceOpAsFld(context, args) {
        let op = args[0];
        if (args[1] !== 'as')
            throw new RequestError_1.default("Expected 'as'.", 400);
        let dst_fld = args[2];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError_1.default("Invalid operation.", 400);
        if (!dst_fld || typeof dst_fld != 'string' || dst_fld.length === 0)
            throw new RequestError_1.default("Invalid destination property.", 400);
        let arr = lodash_1.default.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducer(op), ReduceTransformLogic.getInitial(op)), arr.length);
        let tmp = {};
        ObjectPath_1.setValueByPath(tmp, dst_fld, result);
        context.pushEntity(tmp);
    }
    static reduceOpFldAsFld(context, args) {
        let op = args[0];
        let src_fld = args[1];
        if (args[2] !== 'as')
            throw new RequestError_1.default("Expected 'as'.", 400);
        let dst_fld = args[3];
        if (!op || typeof op != 'string' || op.length === 0)
            throw new RequestError_1.default("Invalid operation.", 400);
        if (!src_fld || typeof src_fld != 'string' || src_fld.length === 0)
            throw new RequestError_1.default("Invalid source property.", 400);
        if (!dst_fld || typeof dst_fld != 'string' || dst_fld.length === 0)
            throw new RequestError_1.default("Invalid destination property.", 400);
        let arr = lodash_1.default.cloneDeep(context.popEntity());
        let result = ReduceTransformLogic.postProcess(op, arr.reduce(ReduceTransformLogic.getReducerOn(op, src_fld), ReduceTransformLogic.getInitial(op)), arr.length);
        let tmp = {};
        ObjectPath_1.setValueByPath(tmp, dst_fld, result);
        context.pushEntity(tmp);
    }
}
exports.default = ReduceTransformLogic;
//# sourceMappingURL=ReduceTransformLogic.js.map