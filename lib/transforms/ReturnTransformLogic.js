"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const ObjectPath_1 = require("../util/ObjectPath");
class ReturnTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            let obj;
            if (args.length === 0)
                obj = context.getCurrentEntity();
            else {
                if (args.length != 1)
                    throw new RequestError_1.default("Invalid number of arguments.", 400);
                let path = lodash_1.default.defaultTo(args[0], '');
                if (path.length === 0)
                    throw new RequestError_1.default("Invalid path.", 400);
                let tmp = ObjectPath_1.getValueByPath(context.popEntity(), path);
                if (tmp.found)
                    obj = tmp.value;
                else
                    throw new RequestError_1.default("Property not found.", 400);
            }
            context.wipe();
            context.pushEntity(obj);
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute pop", 500);
        }
    }
}
exports.default = ReturnTransformLogic;
//# sourceMappingURL=ReturnTransformLogic.js.map