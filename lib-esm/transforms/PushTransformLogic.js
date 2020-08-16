import RequestError from '../RequestError';
import _ from 'lodash';
import { getValueByPath } from '../util/ObjectPath';
export default class PushTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length == 0)
                throw new RequestError("No property path provided.", 400);
            let path = _.defaultTo(args[0], '');
            if (path.length === 0)
                throw new RequestError("Invalid path.", 400);
            let v = getValueByPath(context.getCurrentEntity(), path);
            if (!v.found)
                throw new RequestError("Property not found.", 400);
            context.pushEntity(v.value);
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute push", 500);
        }
    }
}
//# sourceMappingURL=PushTransformLogic.js.map