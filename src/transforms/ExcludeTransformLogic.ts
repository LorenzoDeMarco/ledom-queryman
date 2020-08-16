import RequestContext from '../RequestContext';
import ITransformLogic from '../ITransformLogic';
import RequestError from '../RequestError';

import _ from 'lodash';

export default class ExcludeTransformLogic implements ITransformLogic {

    public apply(context: RequestContext, args: any[], quota_cost: number = 1) {
        switch (args.length) {
            case 1:
                ExcludeTransformLogic.applyExclude(context, args);
                break;
            case 3:
                ExcludeTransformLogic.applyExcludeBut(context, args);
                break;
            default:
                throw new RequestError("Invalid number of arguments.", 400);
        }
    }

    private static applyExclude(context: RequestContext, args: any[]) {
        let e = context.getCurrentEntity();
        if (!e) throw new RequestError("No entity to apply 'exclude' on.", 400);
        if (args[0] === '*') {
            context.setCurrentEntity({});
            return;
        }
        let excl : string[] = args[0].split(',');
        context.setCurrentEntity(ExcludeTransformLogic.exclude(e, excl));
    }

    private static applyExcludeBut(context: RequestContext, args: any[]) {
        let e = context.getCurrentEntity();
        if (!e) throw new RequestError("No entity to apply 'exclude' on.", 400);
        let incl : string[] = args[2].split(',');
        context.setCurrentEntity(ExcludeTransformLogic.excludeAll(e, incl));
    }

    private static exclude(entity: any, fields: string[]) : any {
        let tmp = entity;
        fields.forEach(field => {
            _.unset(tmp, field);
        });
        return tmp;
    }
    
    private static excludeAll(entity: any, but_fields: string[] = []) : any {
        let tmp = entity;
        Object.keys(tmp)
        .filter(key => !(but_fields.includes(key)))
        .forEach(field => {
            _.unset(tmp, field);
        });
        return tmp;
    }
}
