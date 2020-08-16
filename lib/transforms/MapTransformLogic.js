"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestContext_1 = __importDefault(require("../RequestContext"));
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
class MapTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length != 1)
                throw new RequestError_1.default("Invalid number of arguments.", 400);
            if (!lodash_1.default.isArray(context.getCurrentEntity()))
                throw new RequestError_1.default("Not an array", 400);
            let subquery = args[0];
            if (!subquery)
                throw new RequestError_1.default("Invalid subquery.", 400);
            let arr = context.getCurrentEntity();
            context.setCurrentEntity(arr.map(item => {
                let temp_context = new RequestContext_1.default(lodash_1.default.cloneDeep(item), context.getUsedQuota(), context.getQuotaCap());
                let response = temp_context.executeFunctional(subquery, quota_cost);
                if (response.isError)
                    throw new RequestError_1.default(`Subquery error: ${response.errorText}`, response.errorCode, response.errorRef);
                return response.data;
            }));
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute map", 500);
        }
    }
}
exports.default = MapTransformLogic;
//# sourceMappingURL=MapTransformLogic.js.map