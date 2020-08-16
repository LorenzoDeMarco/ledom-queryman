import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';
import { getValueByPath } from '../util/ObjectPath';

export default class ReturnTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            let obj: any;
            if (args.length === 0)
                obj = context.getCurrentEntity();
            else {
                if (args.length != 1)
                    throw new RequestError("Invalid number of arguments.", 400);
                let path : string = _.defaultTo(args[0], '');
                if (path.length === 0)
                    throw new RequestError("Invalid path.", 400);
                let tmp = getValueByPath(context.popEntity(), path);
                if (tmp.found)
                    obj = tmp.value;
                else
                    throw new RequestError("Property not found.", 400);
            }
            context.wipe();
            context.pushEntity(obj);
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute pop", 500);
        }
    }
}
