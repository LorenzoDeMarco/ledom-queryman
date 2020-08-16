import IFilter from './IFilter';
declare class MCFilter {
    protected conditions: IFilter[];
    protected constructor(source: any);
}
declare class KVFilter {
    protected key: string;
    protected use_key: boolean;
    protected key2?: string;
    protected use_key2: boolean;
    protected value?: any;
    protected constructor(source: any);
    protected getFirstValue(obj: any): any;
    protected getSecondValue(obj: any): any;
}
export declare class AndFilter extends MCFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class OrFilter extends MCFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class XorFilter extends MCFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class NotFilter implements IFilter {
    private condition;
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class EqFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class NeqFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class GtFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class LtFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class GteFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export declare class LteFilter extends KVFilter implements IFilter {
    constructor(source: any);
    evalFor(input: any): boolean;
}
export {};
