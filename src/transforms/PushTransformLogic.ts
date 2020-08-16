import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';
import { getValueByPath } from '../util/ObjectPath';

export default class PushTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            if (args.length == 0)
                throw new RequestError("No property path provided.", 400);
            let path : string = _.defaultTo(args[0], '');
            if (path.length === 0)
                throw new RequestError("Invalid path.", 400);
            let v = getValueByPath(context.getCurrentEntity(), path);
            if (!v.found)
                throw new RequestError("Property not found.", 400);
            context.pushEntity(v.value);
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute push", 500);
        }
    }
}
