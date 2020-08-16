"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
class BottomTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            let count = 1;
            if (args.length == 1) {
                try {
                    count = Number(args[0]);
                }
                catch (error) {
                    throw new RequestError_1.default("Not a valid number", 400);
                }
            }
            if (!lodash_1.default.isArray(context.getCurrentEntity()))
                throw new RequestError_1.default("Not an array", 400);
            let arr = context.getCurrentEntity();
            if (count > arr.length)
                count = arr.length;
            context.setCurrentEntity(arr.slice(arr.length - count));
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute map", 500);
        }
    }
}
exports.default = BottomTransformLogic;
//# sourceMappingURL=BottomTransformLogic.js.map