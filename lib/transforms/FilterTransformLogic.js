"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const FilterBuilder_1 = __importDefault(require("../filtering/FilterBuilder"));
class FilterTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length != 1)
                throw new RequestError_1.default("Invalid number of arguments.", 400);
            if (!lodash_1.default.isArray(context.getCurrentEntity()))
                throw new RequestError_1.default("Not an array", 400);
            if (lodash_1.default.isUndefined(args[0]) || lodash_1.default.isNull(args[0]) || typeof args[0] != 'object' || !('op' in args[0]))
                throw new RequestError_1.default("Invalid filter.", 400);
            let filter = FilterBuilder_1.default(args[0]);
            let arr = context.getCurrentEntity();
            context.setCurrentEntity(arr.filter(v => {
                return filter.evalFor(v);
            }));
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute filter", 500);
        }
    }
}
exports.default = FilterTransformLogic;
//# sourceMappingURL=FilterTransformLogic.js.map