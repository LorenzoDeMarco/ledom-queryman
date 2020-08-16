import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';

export default class PushvTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            if (args.length === 0)
                throw new RequestError("No value provided.", 400);
            let value : any = _.defaultTo(args[0], {});
            context.pushEntity(value);
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute push", 500);
        }
    }
}
