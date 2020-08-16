import RequestError from '../RequestError';
import _ from 'lodash';
import buildFilter from '../filtering/FilterBuilder';
export default class FilterTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length != 1)
                throw new RequestError("Invalid number of arguments.", 400);
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            if (_.isUndefined(args[0]) || _.isNull(args[0]) || typeof args[0] != 'object' || !('op' in args[0]))
                throw new RequestError("Invalid filter.", 400);
            let filter = buildFilter(args[0]);
            let arr = context.getCurrentEntity();
            context.setCurrentEntity(arr.filter(v => {
                return filter.evalFor(v);
            }));
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute filter", 500);
        }
    }
}
//# sourceMappingURL=FilterTransformLogic.js.map