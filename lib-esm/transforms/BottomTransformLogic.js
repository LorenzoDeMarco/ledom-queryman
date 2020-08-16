import RequestError from '../RequestError';
import _ from 'lodash';
export default class BottomTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            let count = 1;
            if (args.length == 1) {
                try {
                    count = Number(args[0]);
                }
                catch (error) {
                    throw new RequestError("Not a valid number", 400);
                }
            }
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let arr = context.getCurrentEntity();
            if (count > arr.length)
                count = arr.length;
            context.setCurrentEntity(arr.slice(arr.length - count));
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute map", 500);
        }
    }
}
//# sourceMappingURL=BottomTransformLogic.js.map