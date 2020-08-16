import IRequest from './IRequest';
import IResponse from './IResponse';
import { IRequestTransform } from './IRequestTransform';
export default class RequestContext {
    private stack;
    private usedQuota;
    private quotaCap;
    constructor(current_entity?: any, used_quota?: number, quota_cap?: number);
    getCurrentEntity(): any;
    setCurrentEntity(entity: any): void;
    pushEntity(entity: any): number;
    popEntity(): any;
    wipe(): any;
    getUsedQuota(): number;
    getQuotaCap(): number;
    consumeQuota(amount?: number): boolean;
    private processXformString;
    private getXformLogicInstance;
    private processXform;
    executeFunctional(query: (string | IRequestTransform)[], quota_cost?: number): IResponse;
    processRequest(req: IRequest, quota_cost?: number): IResponse;
}
