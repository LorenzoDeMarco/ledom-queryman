import IFilter from './IFilter';
import RequestError from '../RequestError';

import _ from 'lodash';

import { getValueByPath } from '../util/ObjectPath';
import buildFilter from './FilterBuilder';
import IFilterDefinition from './IFilterDefinition';

class MCFilter {
    protected conditions: IFilter[];

    protected constructor(source: any) {
        if ('cond' in source && _.isArray(source.cond))
            this.conditions = source.cond.map((c: IFilterDefinition) => buildFilter(c));
        else throw new RequestError("Missing or invalid 'cond' property.", 400);
    }
}

class KVFilter {
    protected key: string;
    protected use_key: boolean = false;
    protected key2?: string;
    protected use_key2: boolean = false;
    protected value?: any;

    protected constructor(source: any) {
        if ('key' in source && _.isString(source.key)) {
            this.key = source.key;
            this.use_key = true;
        }
        if ('key2' in source && _.isString(source.key2)) {
            this.key2 = source.key2;
            this.use_key2 = true;
        } else {
            if ('value' in source && !_.isUndefined(source.value)) {
                this.value = source.value;
            } else {
                throw new RequestError("Missing or invalid 'key2' and 'value' properties.", 400);
            }
        }
    }

    protected getFirstValue(obj: any) : any {
        try {
            if (this.use_key) {
                let tmp = getValueByPath(obj, this.key);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return obj;
        } catch (error) {
            throw new RequestError("Property not found.", 400);
        }
    }

    protected getSecondValue(obj: any) : any {
        try {
            if (this.use_key2) {
                let tmp = getValueByPath(obj, this.key2);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return this.value;
        } catch (error) {
            throw new RequestError("Property not found.", 400);
        }
    }
}

export class AndFilter extends MCFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let tmp: boolean = true;
        this.conditions.forEach(condition => {
            tmp = tmp && condition.evalFor(input);
        });
        return tmp;
    }
}

export class OrFilter extends MCFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let tmp: boolean = false;
        this.conditions.forEach(condition => {
            tmp = tmp || condition.evalFor(input);
        });
        return tmp;
    }
}

export class XorFilter extends MCFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }

    public evalFor(input: any) : boolean {
        let tmp: boolean = false;
        this.conditions.forEach(condition => {
            tmp = tmp != condition.evalFor(input);
        });
        return tmp;
    }
}

export class NotFilter implements IFilter {

    private condition: IFilter;

    public constructor(source: any) {
        if ('cond' in source && _.isObject(source.cond))
            this.condition = buildFilter(source.cond);
        else throw new RequestError("Missing or invalid 'cond' property.", 400);
    }
    
    public evalFor(input: any) : boolean {
        return !this.condition.evalFor(input);
    }
}

export class EqFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }

    public evalFor(input: any) : boolean {
        return this.getFirstValue(input) === this.getSecondValue(input);
    }
}

export class NeqFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        return this.getFirstValue(input) != this.getSecondValue(input);
    }
}

export class GtFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 > v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 > v2;
        throw new RequestError("'gt' operator only compares 'number' and 'bigint' values.");
    }
}

export class LtFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 < v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 < v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}

export class GteFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 >= v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 >= v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}

export class LteFilter extends KVFilter implements IFilter {

    public constructor(source: any) {
        super(source);
    }
    
    public evalFor(input: any) : boolean {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 <= v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 <= v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}