import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';

export default class TopTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            let count: number = 1;
            if (args.length == 1)
            {
                try {
                    count = Number(args[0]);
                } catch (error) {
                    throw new RequestError("Not a valid number", 400);
                }
            }
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let arr: Array<any> = context.getCurrentEntity();
            if (count > arr.length) count = arr.length;
            context.setCurrentEntity(arr.slice(0, count));
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute map", 500);
        }
    }
}
