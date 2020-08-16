"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const IResponse_1 = require("./IResponse");
const RequestError_1 = __importDefault(require("./RequestError"));
const ReturnTransformLogic_1 = __importDefault(require("./transforms/ReturnTransformLogic"));
const ExcludeTransformLogic_1 = __importDefault(require("./transforms/ExcludeTransformLogic"));
const PushTransformLogic_1 = __importDefault(require("./transforms/PushTransformLogic"));
const PopTransformLogic_1 = __importDefault(require("./transforms/PopTransformLogic"));
const MapTransformLogic_1 = __importDefault(require("./transforms/MapTransformLogic"));
const PushvTransformLogic_1 = __importDefault(require("./transforms/PushvTransformLogic"));
const TopTransformLogic_1 = __importDefault(require("./transforms/TopTransformLogic"));
const BottomTransformLogic_1 = __importDefault(require("./transforms/BottomTransformLogic"));
const ReverseTransformLogic_1 = __importDefault(require("./transforms/ReverseTransformLogic"));
const SortTransformLogic_1 = __importDefault(require("./transforms/SortTransformLogic"));
const ReduceTransformLogic_1 = __importDefault(require("./transforms/ReduceTransformLogic"));
const FilterTransformLogic_1 = __importDefault(require("./transforms/FilterTransformLogic"));
class RequestContext {
    constructor(current_entity = undefined, used_quota = 0, quota_cap = Infinity) {
        this.stack = [];
        if (!lodash_1.default.isUndefined(current_entity))
            this.stack.push(lodash_1.default.cloneDeep(current_entity));
        this.usedQuota = used_quota;
        this.quotaCap = quota_cap;
    }
    getCurrentEntity() {
        return this.stack[this.stack.length - 1];
    }
    setCurrentEntity(entity) {
        if (this.stack.length > 0)
            this.stack[this.stack.length - 1] = entity;
    }
    pushEntity(entity) {
        return this.stack.push(entity);
    }
    popEntity() {
        return this.stack.pop();
    }
    wipe() {
        let e = undefined;
        while (this.stack.length > 0) {
            e = this.stack.pop();
        }
        return e;
    }
    getUsedQuota() {
        return this.usedQuota;
    }
    getQuotaCap() {
        return this.quotaCap;
    }
    consumeQuota(amount = 1) {
        if (this.usedQuota + amount <= this.quotaCap) {
            this.usedQuota += amount;
            return true;
        }
        return false;
    }
    processXformString(xform) {
        if (!xform || xform.length === 0)
            throw new RequestError_1.default("Invalid transform", 400);
        return this.processXform({ do: xform });
    }
    getXformLogicInstance(action) {
        switch (action) {
            case 'return':
                return new ReturnTransformLogic_1.default();
            case 'exclude':
                return new ExcludeTransformLogic_1.default();
            case 'push':
                return new PushTransformLogic_1.default();
            case 'pop':
                return new PopTransformLogic_1.default();
            case 'map':
                return new MapTransformLogic_1.default();
            case 'top':
                return new TopTransformLogic_1.default();
            case 'bottom':
                return new BottomTransformLogic_1.default();
            case 'sort':
                return new SortTransformLogic_1.default();
            case 'reverse':
                return new ReverseTransformLogic_1.default();
            case 'pushv':
                return new PushvTransformLogic_1.default();
            case 'filter':
                return new FilterTransformLogic_1.default();
            case 'reduce':
                return new ReduceTransformLogic_1.default();
            default:
                throw new RequestError_1.default("Unrecognized transform action", 400);
        }
    }
    processXform(xform, quota_cost = 1) {
        if (!xform || xform.do.length === 0)
            throw new RequestError_1.default("Invalid transform", 400);
        let action = '';
        let args = [];
        let segs = xform.do.split(' ');
        if (segs.length === 0) {
            action = xform.do;
        }
        else {
            if (segs[0].length > 0)
                action = segs[0];
            if (segs.length > 1)
                args = segs.slice(1);
        }
        if (!lodash_1.default.isUndefined(xform.arg)) {
            args.push(xform.arg);
        }
        if (!action || action.length === 0)
            return;
        action = action.toLowerCase();
        let xform_logic = this.getXformLogicInstance(action);
        if (xform_logic)
            xform_logic.apply(this, args, quota_cost);
        return action != "return";
    }
    executeFunctional(query, quota_cost = 1) {
        let idx = 0;
        let response;
        if (!query || query.length === 0)
            return IResponse_1.dataResponse(this.wipe());
        try {
            if (this.quotaCap - this.usedQuota - (query.length * quota_cost) < 0)
                throw new RequestError_1.default("Insufficient quota", 401);
            while (idx < query.length) {
                let next = true;
                if (!this.consumeQuota(quota_cost)) {
                    response = IResponse_1.errorResponse(401, "Reached quota cap");
                    response.remainingQuota = this.quotaCap - this.usedQuota;
                    return response;
                }
                let current_xform = query[idx];
                if (typeof current_xform === 'string') {
                    next = this.processXformString(current_xform);
                }
                else {
                    next = this.processXform(current_xform, quota_cost);
                }
                idx++;
                if (!next)
                    break;
            }
            response = IResponse_1.dataResponse(this.wipe());
        }
        catch (error) {
            if (error instanceof RequestError_1.default) {
                console.error(`Request error: "${error.message}" (code ${error.errorCode})`);
                response = IResponse_1.errorResponse(error.errorCode, error.message, error.errorRef);
            }
            else if (error instanceof Error) {
                console.error('Generic error in request ', error);
                response = IResponse_1.errorResponse(0, error.message);
            }
            response.errorPosition = idx;
        }
        if (!response.remainingQuota)
            response.remainingQuota = this.quotaCap - this.usedQuota;
        return response;
    }
    processRequest(req, quota_cost = 1) {
        if (!req)
            return IResponse_1.dataResponse(this.wipe());
        return this.executeFunctional(req.query, quota_cost);
    }
}
exports.default = RequestContext;
//# sourceMappingURL=RequestContext.js.map