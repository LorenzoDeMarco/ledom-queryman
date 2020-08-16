import _ from 'lodash';

import IRequest from './IRequest';
import IResponse from './IResponse';
import { errorResponse, dataResponse } from './IResponse';
import { IRequestTransform } from './IRequestTransform';
import RequestError from './RequestError';

import ITransformLogic from './ITransformLogic';
import ReturnTransformLogic from './transforms/ReturnTransformLogic';
import ExcludeTransformLogic from './transforms/ExcludeTransformLogic';
import PushTransformLogic from './transforms/PushTransformLogic';
import PopTransformLogic from './transforms/PopTransformLogic';
import MapTransformLogic from './transforms/MapTransformLogic';
import PushvTransformLogic from './transforms/PushvTransformLogic';
import TopTransformLogic from './transforms/TopTransformLogic';
import BottomTransformLogic from './transforms/BottomTransformLogic';
import ReverseTransformLogic from './transforms/ReverseTransformLogic';
import SortTransformLogic from './transforms/SortTransformLogic';
import ReduceTransformLogic from './transforms/ReduceTransformLogic';
import FilterTransformLogic from './transforms/FilterTransformLogic';

export default class RequestContext {
    private stack: Array<any>;

    private usedQuota: number;
    private quotaCap: number;

    constructor(current_entity: any = undefined, used_quota: number = 0, quota_cap: number = Infinity) {
        this.stack = [];
        if (!_.isUndefined(current_entity)) this.stack.push(_.cloneDeep(current_entity));
        this.usedQuota = used_quota;
        this.quotaCap = quota_cap;
    }

    public getCurrentEntity() : any {
        return this.stack[this.stack.length - 1];
    }

    public setCurrentEntity(entity: any) : void {
        if (this.stack.length > 0) this.stack[this.stack.length - 1] = entity;
    }

    public pushEntity(entity : any) : number {
        return this.stack.push(entity);
    }

    public popEntity() : any {
        return this.stack.pop();
    }

    public wipe() : any {
        let e: any = undefined;
        while (this.stack.length > 0) {
            e = this.stack.pop();
        }
        return e;
    }

    public getUsedQuota() : number {
        return this.usedQuota;
    }

    public getQuotaCap() : number {
        return this.quotaCap;
    }

    public consumeQuota(amount: number = 1) : boolean {
        if (this.usedQuota + amount <= this.quotaCap) {
            this.usedQuota += amount;
            return true;
        }
        return false;
    }

    private processXformString(xform: string) : boolean {
        if (!xform || xform.length === 0)
            throw new RequestError("Invalid transform", 400);
        return this.processXform({ do: xform });
    }

    private getXformLogicInstance(action: string) : ITransformLogic {
        switch (action) {  
            case 'return':
                return new ReturnTransformLogic();
            case 'exclude':
                return new ExcludeTransformLogic();
            case 'push':
                return new PushTransformLogic();
            case 'pop':
                return new PopTransformLogic();
            case 'map':
                return new MapTransformLogic();
            case 'top':
                return new TopTransformLogic();
            case 'bottom':
                return new BottomTransformLogic();
            case 'sort':
                return new SortTransformLogic();
            case 'reverse':
                return new ReverseTransformLogic();
            case 'pushv':
                return new PushvTransformLogic();
            case 'filter':
                return new FilterTransformLogic();
            case 'reduce':
                return new ReduceTransformLogic();
            default:
                throw new RequestError("Unrecognized transform action", 400);
        }
    }

    private processXform(xform: IRequestTransform, quota_cost: number = 1) : boolean {
        if (!xform || xform.do.length === 0)
            throw new RequestError("Invalid transform", 400);
        let action : string = '';
        let args = [];
        let segs : string[] = xform.do.split(' ');
        if (segs.length === 0) {
            action = xform.do;
        } else {
            if (segs[0].length > 0) action = segs[0];
            if (segs.length > 1) args = segs.slice(1);
        }
        if (!_.isUndefined(xform.arg)) {
            args.push(xform.arg);
        }
        if (!action || action.length === 0) return;
        action = action.toLowerCase();

        let xform_logic : ITransformLogic = this.getXformLogicInstance(action);
        if (xform_logic) xform_logic.apply(this, args, quota_cost);

        return action != "return";
    }

    public executeFunctional(query: (string | IRequestTransform)[], quota_cost: number = 1) : IResponse {
        let idx = 0;
        let response: IResponse;
        if (!query || query.length === 0)
            return dataResponse(this.wipe());
        try {
            if (this.quotaCap - this.usedQuota - (query.length * quota_cost) < 0)
                throw new RequestError("Insufficient quota", 401);
            while (idx < query.length) {
                let next = true;
                if (!this.consumeQuota(quota_cost))
                {
                    response = errorResponse(401, "Reached quota cap");
                    response.remainingQuota = this.quotaCap - this.usedQuota;
                    return response;
                }
                let current_xform = query[idx];
                if (typeof current_xform === 'string') {
                    next = this.processXformString(current_xform);
                } else {
                    next = this.processXform(current_xform, quota_cost);
                }
                idx++;
                if (!next) break;
            }
            response = dataResponse(this.wipe());
        } catch (error) {
            if (error instanceof RequestError) {
                console.error(`Request error: "${error.message}" (code ${error.errorCode})`);
                response = errorResponse(error.errorCode, error.message, error.errorRef);
            } else if (error instanceof Error) {
                console.error('Generic error in request ', error);
                response = errorResponse(0, error.message);
            }
            response.errorPosition = idx;
        }
        if (!response.remainingQuota) response.remainingQuota = this.quotaCap - this.usedQuota;
        return response;
    }

    public processRequest(req: IRequest, quota_cost: number = 1) : IResponse {
        if (!req) return dataResponse(this.wipe());
        return this.executeFunctional(req.query, quota_cost);
    }
}