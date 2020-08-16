"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../RequestError"));
const lodash_1 = __importDefault(require("lodash"));
const ObjectPath_1 = require("../util/ObjectPath");
class PopTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length < 2)
                throw new RequestError_1.default("Invalid number of arguments.", 400);
            if (args.length === 2) { // pop as <field>
                if (args[0] !== 'as')
                    throw new RequestError_1.default("Expected 'as' token.", 400);
                let path = lodash_1.default.defaultTo(args[1], '');
                if (path.length === 0)
                    throw new RequestError_1.default("Invalid path.", 400);
                let value = lodash_1.default.cloneDeep(lodash_1.default.defaultTo(context.popEntity(), null));
                ObjectPath_1.setValueByPath(context.getCurrentEntity(), path, value);
            }
            else if (args.length === 3) { // pop <src_field> as <dst_field>
                if (args[1] !== 'as')
                    throw new RequestError_1.default("Expected 'as' token.", 400);
                let src_path = lodash_1.default.defaultTo(args[0], '');
                let dst_path = lodash_1.default.defaultTo(args[2], '');
                if (src_path.length === 0)
                    throw new RequestError_1.default("Invalid source path.", 400);
                if (dst_path.length === 0)
                    throw new RequestError_1.default("Invalid target path.", 400);
                let value = ObjectPath_1.getValueByPath(context.popEntity(), src_path);
                if (!value.found)
                    throw new RequestError_1.default("Source property not found.", 400);
                ObjectPath_1.setValueByPath(context.getCurrentEntity(), dst_path, value.value);
            }
        }
        catch (error) {
            if (error instanceof RequestError_1.default)
                throw error;
            throw new RequestError_1.default("Failed to execute pop", 500);
        }
    }
}
exports.default = PopTransformLogic;
//# sourceMappingURL=PopTransformLogic.js.map