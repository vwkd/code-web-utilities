/**
 * Simple shallow merge of two objects
 * Merges source into target, source overwrites target
 * Returns new object, doesn't mutate inputs
 * beware: doesn't consider non-enumberable properties, prototype properties, etc.
 * beware: differs from pure Object.assign() because doesn't merge array + object OR object + array
 */
export function shallowMerge(target: unknown, source: unknown): unknown {
    function isObjectOrArray(obj: unknown): obj is object {
        return obj && typeof obj === "object";
    }

    function isArray(obj: unknown): obj is unknown[] {
        return Array.isArray(obj);
    }

    if (isArray(target) && isArray(source)) {
        // array + array
        return source;
    } else if (isObjectOrArray(target) && isObjectOrArray(source)) {
        // array + object OR object + array OR object + object
        if (isArray(target) || isArray(source)) {
            // array + object OR object + array
            return source;
        } else {
            // object + object
            return Object.assign({}, target, source);
        }
    } else {
        // scalar + scalar OR object + scalar OR scalar + object
        return source;
    }
}

/**
 * Shallow merge for multiple objects
 */
export function shallowMergeArr(target: unknown, ...source: unknown[]): unknown {
    const [first, ...rest] = source;
    const res = shallowMerge(target, first);
    return rest.length > 0 ? shallowMergeArr(res, ...rest) : res;
}
