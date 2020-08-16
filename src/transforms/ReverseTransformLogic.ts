import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';

export default class ReverseTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        try {
            if (args.length != 0)
                throw new RequestError("Expected no arguments", 400);
            if (!_.isArray(context.getCurrentEntity()))
                throw new RequestError("Not an array", 400);
            let arr: Array<any> = context.getCurrentEntity();
            context.setCurrentEntity(arr.reverse());
        } catch (error) {
            if (error instanceof RequestError) throw error;
            throw new RequestError("Failed to execute map", 500);
        }
    }
}
