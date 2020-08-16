"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const ObjectPath_1 = require("../util/ObjectPath");
class PushTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length == 0)
                throw new RequestError_1.default("No property path provided.", 400);
            let path = lodash_1.default.defaultTo(args[0], '');
            if (path.length === 0)
                throw new RequestError_1.default("Invalid path.", 400);
            let v = ObjectPath_1.getValueByPath(context.getCurrentEntity(), path);
            if (!v.found)
                throw new RequestError_1.default("Property not found.", 400);
            context.pushEntity(v.value);
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute push", 500);
        }
    }
}
exports.default = PushTransformLogic;
//# sourceMappingURL=PushTransformLogic.js.map