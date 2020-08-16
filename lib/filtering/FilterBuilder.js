"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const Filters_1 = require("./Filters");
function buildFilter(filter_obj) {
    switch (filter_obj.op) {
        case 'and':
            return new Filters_1.AndFilter(filter_obj);
        case 'or':
            return new Filters_1.OrFilter(filter_obj);
        case 'xor':
            return new Filters_1.XorFilter(filter_obj);
        case 'not':
            return new Filters_1.NotFilter(filter_obj);
        case 'eq':
            return new Filters_1.EqFilter(filter_obj);
        case 'neq':
            return new Filters_1.NeqFilter(filter_obj);
        case 'gt':
            return new Filters_1.GtFilter(filter_obj);
        case 'lt':
            return new Filters_1.LtFilter(filter_obj);
        case 'gte':
            return new Filters_1.GteFilter(filter_obj);
        case 'lte':
            return new Filters_1.LteFilter(filter_obj);
        default:
            throw new RequestError_1.default("Invalid filter operator.", 400);
    }
}
exports.default = buildFilter;
//# sourceMappingURL=FilterBuilder.js.map