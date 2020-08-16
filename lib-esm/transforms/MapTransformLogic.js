import RequestContext from '../RequestContext';
import RequestError from '../RequestError';
import _ from 'lodash';
export default class MapTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length != 1)
                throw new RequestError("Invalid number of arguments.", 400);
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let subquery = args[0];
            if (!subquery)
                throw new RequestError("Invalid subquery.", 400);
            let arr = context.getCurrentEntity();
            context.setCurrentEntity(arr.map(item => {
                let temp_context = new RequestContext(_.cloneDeep(item), context.getUsedQuota(), context.getQuotaCap());
                let response = temp_context.executeFunctional(subquery, quota_cost);
                if (response.isError)
                    throw new RequestError(`Subquery error: ${response.errorText}`, response.errorCode, response.errorRef);
                return response.data;
            }));
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute map", 500);
        }
    }
}
//# sourceMappingURL=MapTransformLogic.js.map