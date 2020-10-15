/**
 * Simple deep merge of two objects
 * Merges source into target, source overwrites target
 * Returns new object, doesn't mutate inputs
 * beware: doesn't consider non-enumberable properties, prototype properties, circular dependencies, getter / setter, symbol keys, etc.
 */
export function deepMerge(target: any, source: any) {
    function isObjectOrArray(obj: any): obj is {[index: string]: any} {
        return obj && typeof obj === "object";
    }

    function isArray(obj: any): obj is any[] {
        return Array.isArray(obj);
    }

    function recursiveMerge(target: any, source: any) {
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
