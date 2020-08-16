import RequestError from '../RequestError';
import _ from 'lodash';
import { setValueByPath, getValueByPath } from '../util/ObjectPath';
export default class PopTransformLogic {
    apply(context, args, quota_cost = 1) {
        try {
            if (args.length < 2)
                throw new RequestError("Invalid number of arguments.", 400);
            if (args.length === 2) { // pop as <field>
                if (args[0] !== 'as')
                    throw new RequestError("Expected 'as' token.", 400);
                let path = _.defaultTo(args[1], '');
                if (path.length === 0)
                    throw new RequestError("Invalid path.", 400);
                let value = _.cloneDeep(_.defaultTo(context.popEntity(), null));
                setValueByPath(context.getCurrentEntity(), path, value);
            }
            else if (args.length === 3) { // pop <src_field> as <dst_field>
                if (args[1] !== 'as')
                    throw new RequestError("Expected 'as' token.", 400);
                let src_path = _.defaultTo(args[0], '');
                let dst_path = _.defaultTo(args[2], '');
                if (src_path.length === 0)
                    throw new RequestError("Invalid source path.", 400);
                if (dst_path.length === 0)
                    throw new RequestError("Invalid target path.", 400);
                let value = getValueByPath(context.popEntity(), src_path);
                if (!value.found)
                    throw new RequestError("Source property not found.", 400);
                setValueByPath(context.getCurrentEntity(), dst_path, value.value);
            }
        }
        catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError("Failed to execute pop", 500);
        }
    }
}
//# sourceMappingURL=PopTransformLogic.js.map