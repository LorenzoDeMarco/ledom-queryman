"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LteFilter = exports.GteFilter = exports.LtFilter = exports.GtFilter = exports.NeqFilter = exports.EqFilter = exports.NotFilter = exports.XorFilter = exports.OrFilter = exports.AndFilter = void 0;
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const ObjectPath_1 = require("../util/ObjectPath");
const FilterBuilder_1 = __importDefault(require("./FilterBuilder"));
class MCFilter {
    constructor(source) {
        if ('cond' in source && lodash_1.default.isArray(source.cond))
            this.conditions = source.cond.map((c) => FilterBuilder_1.default(c));
        else
            throw new RequestError_1.default("Missing or invalid 'cond' property.", 400);
    }
}
class KVFilter {
    constructor(source) {
        this.use_key = false;
        this.use_key2 = false;
        if ('key' in source && lodash_1.default.isString(source.key)) {
            this.key = source.key;
            this.use_key = true;
        }
        if ('key2' in source && lodash_1.default.isString(source.key2)) {
            this.key2 = source.key2;
            this.use_key2 = true;
        }
        else {
            if ('value' in source && !lodash_1.default.isUndefined(source.value)) {
                this.value = source.value;
            }
            else {
                throw new RequestError_1.default("Missing or invalid 'key2' and 'value' properties.", 400);
            }
        }
    }
    getFirstValue(obj) {
        try {
            if (this.use_key) {
                let tmp = ObjectPath_1.getValueByPath(obj, this.key);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return obj;
        }
        catch (error) {
            throw new RequestError_1.default("Property not found.", 400);
        }
    }
    getSecondValue(obj) {
        try {
            if (this.use_key2) {
                let tmp = ObjectPath_1.getValueByPath(obj, this.key2);
                if (!tmp.found)
                    throw new Error();
                return tmp.value;
            }
            return this.value;
        }
        catch (error) {
            throw new RequestError_1.default("Property not found.", 400);
        }
    }
}
class AndFilter extends MCFilter {
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
exports.AndFilter = AndFilter;
class OrFilter extends MCFilter {
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
exports.OrFilter = OrFilter;
class XorFilter extends MCFilter {
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
exports.XorFilter = XorFilter;
class NotFilter {
    constructor(source) {
        if ('cond' in source && lodash_1.default.isObject(source.cond))
            this.condition = FilterBuilder_1.default(source.cond);
        else
            throw new RequestError_1.default("Missing or invalid 'cond' property.", 400);
    }
    evalFor(input) {
        return !this.condition.evalFor(input);
    }
}
exports.NotFilter = NotFilter;
class EqFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        return this.getFirstValue(input) === this.getSecondValue(input);
    }
}
exports.EqFilter = EqFilter;
class NeqFilter extends KVFilter {
    constructor(source) {
        super(source);
    }
    evalFor(input) {
        return this.getFirstValue(input) != this.getSecondValue(input);
    }
}
exports.NeqFilter = NeqFilter;
class GtFilter extends KVFilter {
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
        throw new RequestError_1.default("'gt' operator only compares 'number' and 'bigint' values.");
    }
}
exports.GtFilter = GtFilter;
class LtFilter extends KVFilter {
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
        throw new RequestError_1.default("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
exports.LtFilter = LtFilter;
class GteFilter extends KVFilter {
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
        throw new RequestError_1.default("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
exports.GteFilter = GteFilter;
class LteFilter extends KVFilter {
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
        throw new RequestError_1.default("'lt' operator only compares 'number' and 'bigint' values.");
    }
}
exports.LteFilter = LteFilter;
//# sourceMappingURL=Filters.js.map