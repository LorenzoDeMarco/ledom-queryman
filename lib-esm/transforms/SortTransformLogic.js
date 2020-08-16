import RequestError from '../RequestError';
import _ from 'lodash';
export default class SortTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let arr = context.getCurrentEntity();
            switch (args.length) {
                case 1: // sort <asc|desc>
                    if (args[0] === 'asc')
                        arr = arr.sort();
                    else if (args[0] === 'desc')
                        arr = arr.sort().reverse();
                    else
                        throw new RequestError("Invalid sorting order.", 400);
                    break;
                case 3: // sort <asc|desc> by <fld>
                    let fld = args[2];
                    if (typeof fld != 'string' || fld.length === 0)
                        throw new RequestError("Invalid sorting field.", 400);
                    if (args[0] === 'asc')
                        arr = _.sortBy(arr, fld);
                    else if (args[0] === 'desc')
                        arr = _.sortBy(arr, fld).reverse();
                    else
                        throw new RequestError("Invalid sorting order.", 400);
                    break;
                default:
                    throw new RequestError("Invalid number of arguments.", 400);
            }
            context.setCurrentEntity(arr);
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute sort", 500);
        }
    }
}
//# sourceMappingURL=SortTransformLogic.js.map