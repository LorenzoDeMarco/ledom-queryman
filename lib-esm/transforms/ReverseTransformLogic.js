import RequestError from '../RequestError';
import _ from 'lodash';
export default class ReverseTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length != 0)
                throw new RequestError("Expected no arguments", 400);
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let arr = context.getCurrentEntity();
            context.setCurrentEntity(arr.reverse());
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute map", 500);
        }
    }
}
//# sourceMappingURL=ReverseTransformLogic.js.map