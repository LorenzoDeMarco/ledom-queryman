"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
class SortTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (!lodash_1.default.isArray(context.getCurrentEntity()))
                throw new RequestError_1.default("Not an array", 400);
            let arr = context.getCurrentEntity();
            switch (args.length) {
                case 1: // sort <asc|desc>
                    if (args[0] === 'asc')
                        arr = arr.sort();
                    else if (args[0] === 'desc')
                        arr = arr.sort().reverse();
                    else
                        throw new RequestError_1.default("Invalid sorting order.", 400);
                    break;
                case 3: // sort <asc|desc> by <fld>
                    let fld = args[2];
                    if (typeof fld != 'string' || fld.length === 0)
                        throw new RequestError_1.default("Invalid sorting field.", 400);
                    if (args[0] === 'asc')
                        arr = lodash_1.default.sortBy(arr, fld);
                    else if (args[0] === 'desc')
                        arr = lodash_1.default.sortBy(arr, fld).reverse();
                    else
                        throw new RequestError_1.default("Invalid sorting order.", 400);
                    break;
                default:
                    throw new RequestError_1.default("Invalid number of arguments.", 400);
            }
            context.setCurrentEntity(arr);
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute sort", 500);
        }
    }
}
exports.default = SortTransformLogic;
//# sourceMappingURL=SortTransformLogic.js.map