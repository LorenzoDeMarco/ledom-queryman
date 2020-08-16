import RequestError from '../RequestError';
import _ from 'lodash';
export default class PushvTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length === 0)
                throw new RequestError("No value provided.", 400);
            let value = _.defaultTo(args[0], {});
            context.pushEntity(value);
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute push", 500);
        }
    }
}
//# sourceMappingURL=PushvTransformLogic.js.map