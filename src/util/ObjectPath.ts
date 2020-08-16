import _ from 'lodash';

export function hasPath(object: any, path: string) : boolean {
    return _.hasIn(object, path);
}

export function getValueByPath(object: any, path: string) : {value: any, found: boolean} {
    if (_.hasIn(object, path))
        return { value: _.get(object, path, undefined), found: true };
    else
        return { value: undefined, found: false };
}

export function setValueByPath(object: any, path: string, value: any) : void {
    _.set(object, path, value);
}