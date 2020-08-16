import RequestError from '../RequestError';
import _ from 'lodash';
import { getValueByPath } from '../util/ObjectPath';
import buildFilter from './FilterBuilder';
class MCFilter {
    constructor(source) {
        if ('cond' in source && _.isArray(source.cond))
            this.conditions = source.cond.map((c) => buildFilter(c));
        else
            throw new RequestError("Missing or invalid 'cond' property.", 400);
    }
}
class KVFilter {
    constructor(source) {
        this.use_key = false;
        this.use_key2 = false;
        if ('key' in source && _.isString(source.key)) {
            this.key = source.key;
            this.use_key = true;
        }
        if ('key2' in source && _.isString(source.key2)) {
            this.key2 = source.key2;
            this.use_key2 = true;
        }
        else {
            if ('value' in source && !_.isUndefined(source.value)) {
                this.value = source.value;
            }
            else {
                throw new RequestError("Missing or invalid 'key2' and 'value' properties.", 400);
            }
        }
    }
    getFirstValue(obj) {
        try {
            if (this.use_key) {
                let tmp = getValueByPath(obj, this.key);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return obj;
        }
        catch (error) {
            throw new RequestError("Property not found.", 400);
        }
    }
    getSecondValue(obj) {
        try {
            if (this.use_key2) {
                let tmp = getValueByPath(obj, this.key2);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return this.value;
        }
        catch (error) {
            throw new RequestError("Property not found.", 400);
        }
    }
}
export class AndFilter extends MCFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let tmp = true;
        this.conditions.forEach(condition => {
            tmp = tmp && condition.evalFor(input);
        });
        return tmp;
    }
}
export class OrFilter extends MCFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let tmp = false;
        this.conditions.forEach(condition => {
            tmp = tmp || condition.evalFor(input);
        });
        return tmp;
    }
}
export class XorFilter extends MCFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let tmp = false;
        this.conditions.forEach(condition => {
            tmp = tmp != condition.evalFor(input);
        });
        return tmp;
    }
}
export class NotFilter {
    constructor(source) {
        if ('cond' in source && _.isObject(source.cond))
            this.condition = buildFilter(source.cond);
        else
            throw new RequestError("Missing or invalid 'cond' property.", 400);
    }
    evalFor(input) {
        return !this.condition.evalFor(input);
    }
}
export class EqFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        return this.getFirstValue(input) === this.getSecondValue(input);
    }
}
export class NeqFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        return this.getFirstValue(input) != this.getSecondValue(input);
    }
}
export class GtFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 > v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 > v2;
        throw new RequestError("'gt' operator only compares 'number' and 'bigint' values.");
    }
}
export class LtFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 < v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 < v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
export class GteFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 >= v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 >= v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
export class LteFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        let v1 = this.getFirstValue(input);
        let v2 = this.getSecondValue(input);
        if (typeof v1 === 'number' && typeof v2 === 'number')
            return v1 <= v2;
        if (typeof v1 === 'bigint' && typeof v2 === 'bigint')
            return v1 <= v2;
        throw new RequestError("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
//# sourceMappingURL=Filters.js.map