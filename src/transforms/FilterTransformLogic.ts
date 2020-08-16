import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';
import buildFilter from '../filtering/FilterBuilder';
import IFilter from '../filtering/IFilter';

export default class FilterTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            if (args.length != 1)
                throw new RequestError("Invalid number of arguments.", 400);
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            if (_.isUndefined(args[0]) || _.isNull(args[0]) || typeof args[0] != 'object' || !('op' in args[0]))
                throw new RequestError("Invalid filter.", 400);
            let filter : IFilter = buildFilter(args[0]);
            let arr: Array<any> = context.getCurrentEntity();
            context.setCurrentEntity(arr.filter(v => {
                return filter.evalFor(v);
            }));
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute filter", 500);
        }
    }
}
