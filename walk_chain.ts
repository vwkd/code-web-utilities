/**
 * Walks up chain of linked nodes
 * for each node executes a callback function
 * @param startNode node from which to start walking
 * @param linkName property name that contains the linked node
 * @param callback function executed for each node, is passed the current node and the return value of the previous callback
 */
export function walkChainCall<L extends string, T extends { L: T }, V>(
    startNode: T,
    linkName: L,
    callback: (node: T, lastValue: V) => V
): V {
    function recursion(node, lastValue) {
        const returnValue = callback(node, lastValue);
        if (node[linkName]) {
            return recursion(node[linkName], returnValue);
        } else {
            return returnValue;
        }
    }
    return recursion(startNode, undefined);
}

/**
 * Walks up chain of linked nodes
 * merges the specified property over all linked nodes, earlier from start node overwrite later towards root note
 * @param startNode node from which to start walking
 * @param linkName property name that contains the linked node
 * @param propertyName property name that is shallow merged
 * @param mergeFunction function that merges two properties, e.g. shallowMerge, deepMerge, etc.
 * @returns copy of the merged property, doesn't mutate nodes
 */
export function walkChainMerge<
    L extends string,
    M extends string,
    U extends unknown,
    T extends { L: T; M: U }
>(startNode: T, linkName: L, propertyName: M, mergeFunction: (a: U, b: U) => U): U {
    function recursion(node) {
        const localProperty = node[propertyName];
        return node[linkName]
            ? mergeFunction(recursion(node[linkName]), localProperty)
            : localProperty;
    }

    return recursion(startNode);
}