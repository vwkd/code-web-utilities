/**
 * Simple deep merge of two objects
 * Merges source into target, source overwrites target
 * Returns new object, doesn't mutate inputs
 * beware: doesn't consider non-enumberable properties, prototype properties, circular dependencies, getter / setter, symbol keys, etc.
 */
export function deepMerge(target: unknown, source: unknown) {
    function isObjectOrArray(obj: unknown): obj is {[index: string]: unknown} {
        return obj && typeof obj === "object";
    }

    function isArray(obj: unknown): obj is unknown[] {
        return Array.isArray(obj);
    }

    function recursiveMerge(target: unknown, source: unknown) {
        if (isArray(target) && isArray(source)) {
            // array + array
            return target.concat(source);
        } else if (isObjectOrArray(target) && isObjectOrArray(source)) {
            // array + object OR object + array OR object + object
            if (isArray(target) || isArray(source)) {
                // array + object OR object + array
                return source;
            } else {
                // object + object
                const newTarget = Object.assign({}, target);
                Object.keys(source).forEach(key => {
                    const targetValue = target[key];
                    const sourceValue = source[key];
                    newTarget[key] = deepMerge(targetValue, sourceValue);
                });
                return newTarget;
            }
        } else {
            // scalar + scalar OR object + scalar OR scalar + object
            return source;
        }
    }

    return recursiveMerge(target, source);
}

/**
 * Deep merge for multiple objects
 */
export function deepMergeArr(target: unknown, ...source: unknown[]) {
    const [first, ...rest] = source;
    const res = deepMerge(target, first)
    return rest.length > 0 ? deepMergeArr(res, ...rest) : res;
}
