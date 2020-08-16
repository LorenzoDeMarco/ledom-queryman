import IFilter from './IFilter';
import IFilterDefinition from './IFilterDefinition';
import RequestError from '../RequestError';
import { AndFilter, OrFilter, XorFilter, NotFilter, 
    EqFilter, NeqFilter, GtFilter, LtFilter, GteFilter, LteFilter } from './Filters';

export default function buildFilter(filter_obj : IFilterDefinition) : IFilter {
    switch (filter_obj.op) {
        case 'and':
            return new AndFilter(filter_obj);
        case 'or':
            return new OrFilter(filter_obj);
        case 'xor':
            return new XorFilter(filter_obj);
        case 'not':
            return new NotFilter(filter_obj);
        case 'eq':
            return new EqFilter(filter_obj);
        case 'neq':
            return new NeqFilter(filter_obj);
        case 'gt':
            return new GtFilter(filter_obj);
        case 'lt':
            return new LtFilter(filter_obj);
        case 'gte':
            return new GteFilter(filter_obj);
        case 'lte':
            return new LteFilter(filter_obj);
        default:
            throw new RequestError("Invalid filter operator.", 400);
    }
}