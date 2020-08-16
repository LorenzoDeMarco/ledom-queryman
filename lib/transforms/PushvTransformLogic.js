"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
class PushvTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length === 0)
                throw new RequestError_1.default("No value provided.", 400);
            let value = lodash_1.default.defaultTo(args[0], {});
            context.pushEntity(value);
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute push", 500);
        }
    }
}
exports.default = PushvTransformLogic;
//# sourceMappingURL=PushvTransformLogic.js.map