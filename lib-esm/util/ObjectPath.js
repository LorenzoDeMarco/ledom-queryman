import _ from 'lodash';
export function hasPath(object, path) {
    return _.hasIn(object, path);
}
export function getValueByPath(object, path) {
    if (_.hasIn(object, path))
        return { value: _.get(object, path, undefined), found: true };
    else
        return { value: undefined, found: false };
}
export function setValueByPath(object, path, value) {
    _.set(object, path, value);
}
//# sourceMappingURL=ObjectPath.js.map