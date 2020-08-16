"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setValueByPath = exports.getValueByPath = exports.hasPath = void 0;
const lodash_1 = __importDefault(require("lodash"));
function hasPath(object, path) {
    return lodash_1.default.hasIn(object, path);
}
exports.hasPath = hasPath;
function getValueByPath(object, path) {
    if (lodash_1.default.hasIn(object, path))
        return { value: lodash_1.default.get(object, path, undefined), found: true };
    else
        return { value: undefined, found: false };
}
exports.getValueByPath = getValueByPath;
function setValueByPath(object, path, value) {
    lodash_1.default.set(object, path, value);
}
exports.setValueByPath = setValueByPath;
//# sourceMappingURL=ObjectPath.js.map