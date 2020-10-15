/**
 * Simple shallow merge of two objects
 * Merges source into target, source overwrites target
 * Returns new object, doesn't mutate inputs
 * beware: doesn't consider non-enumberable properties, prototype properties, etc.
 * beware: differs from pure Object.assign() because doesn't merge array + object OR object + array
 */
export function shallowMerge(target: any, source: any) {
    function isObjectOrArray(obj: any): obj is { [index: string]: any } {
        return obj && typeof obj === "object";
    }

    function isArray(obj: any): obj is any[] {
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
