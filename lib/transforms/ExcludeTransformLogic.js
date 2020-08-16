"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
class ExcludeTransformLogic {
    apply(context, args, quota_cost = 1) {
        switch (args.length) {
            case 1:
                ExcludeTransformLogic.applyExclude(context, args);
                break;
            case 3:
                ExcludeTransformLogic.applyExcludeBut(context, args);
                break;
            default:
                throw new RequestError_1.default("Invalid number of arguments.", 400);
        }
    }
    static applyExclude(context, args) {
        let e = context.getCurrentEntity();
        if (!e)
            throw new RequestError_1.default("No entity to apply 'exclude' on.", 400);
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
            throw new RequestError_1.default("No entity to apply 'exclude' on.", 400);
        let incl = args[2].split(',');
        context.setCurrentEntity(ExcludeTransformLogic.excludeAll(e, incl));
    }
    static exclude(entity, fields) {
        let tmp = entity;
        fields.forEach(field => {
            lodash_1.default.unset(tmp, field);
        });
        return tmp;
    }
    static excludeAll(entity, but_fields = []) {
        let tmp = entity;
        Object.keys(tmp)
            .filter(key => !(but_fields.includes(key)))
            .forEach(field => {
            lodash_1.default.unset(tmp, field);
        });
        return tmp;
    }
}
exports.default = ExcludeTransformLogic;
//# sourceMappingURL=ExcludeTransformLogic.js.map