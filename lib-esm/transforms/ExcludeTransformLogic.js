import RequestError from '../RequestError';
import _ from 'lodash';
export default class ExcludeTransformLogic {
    apply(context, args, quota_cost = 1) {
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
    static applyExclude(context, args) {
        let e = context.getCurrentEntity();
        if (!e)
            throw new RequestError("No entity to apply 'exclude' on.", 400);
        if (args[0] === '*') {
            context.setCurrentEntity({});
            return;
        }
        let excl = args[0].split(',');
        context.setCurrentEntity(ExcludeTransformLogic.exclude(e, excl));
    }
    static applyExcludeBut(context, args) {
        let e = context.getCurrentEntity();
        if (!e)
            throw new RequestError("No entity to apply 'exclude' on.", 400);
        let incl = args[2].split(',');
        context.setCurrentEntity(ExcludeTransformLogic.excludeAll(e, incl));
    }
    static exclude(entity, fields) {
        let tmp = entity;
        fields.forEach(field => {
            _.unset(tmp, field);
        });
        return tmp;
    }
    static excludeAll(entity, but_fields = []) {
        let tmp = entity;
        Object.keys(tmp)
            .filter(key => !(but_fields.includes(key)))
            .forEach(field => {
            _.unset(tmp, field);
        });
        return tmp;
    }
}
//# sourceMappingURL=ExcludeTransformLogic.js.map