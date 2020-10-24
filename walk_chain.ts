// ToDo: computed property name in TypeScript? Because linkName, mergeProperty, idName aren't correct, actual value is only known at runtime... Probably not possible?!

type Node = {
    linkName: Node;
};

type NodeMerge = {
    linkName: NodeMerge;
    mergeProperty: unknown;
};

type NodeId = {
    linkName: string;
    idName: string;
};

type NodeIdMerge = {
    linkName: string;
    idName: string;
    mergeProperty: unknown;
};

/**
 * Walks along chain of linked nodes.
 * For each node executes a callback function.
 * Stops at node which doesn't have another linked node.
 * @param startNode node from which to start walking
 * @param linkName property name that contains the linked node
 * @param callback function executed for each node, is passed the current node, the return value of the previous callback, and the data argument
 * @param data optional argument passed through to every callback function
 * @returns return value of last callback
 */
export function walkChainCallSync<U extends unknown>({
    startNode,
    linkName,
    callback,
    data
}: {
    startNode: Node;
    linkName: string;
    callback: (node: Node, lastValue: U, data: unknown) => U;
    data?: unknown;
}): U {
    function recursion(node: Node, lastValue: U, visitedNodes: Node[], data: unknown) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        const returnValue = callback(node, lastValue, data);
        const nextNode = node[linkName];

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return returnValue;
        }

        // linked node doesn't exists, stop here
        if (nextNode === undefined) {
            return returnValue;
        }
        
        // linked node exists, go deeper
        else {
            return recursion(nextNode, returnValue, visitedNodes, data);
        }
    }
    return recursion(startNode, undefined, [], data);
}

export async function walkChainCall<U extends unknown>({
    startNode,
    linkName,
    callback,
    data
}: {
    startNode: Node;
    linkName: string;
    callback: (node: Node, lastValue: U, data: unknown) => Promise<U>;
    data?: unknown;
}): Promise<U> {
    async function recursion(node: Node, lastValue: U, visitedNodes: Node[], data: unknown) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        const returnValue = await callback(node, lastValue, data);
        const nextNode = node[linkName];

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return returnValue;
        }

        // linked node doesn't exists, stop here
        if (nextNode === undefined) {
            return returnValue;
        }
        
        // linked node exists, go deeper
        else {
            return await recursion(nextNode, returnValue, visitedNodes, data);
        }
    }
    return recursion(startNode, undefined, [], data);
}

/**
 * Walks along chain of linked nodes.
 * Merges the specified property over all linked nodes, earlier from start node overwrite later towards root node.
 * Stops at node which doesn't have another linked node.
 * Doesn't merge in property if undefined.
 * @param startNode node from which to start walking
 * @param linkName property name that contains the linked node
 * @param mergeProperty property name that is merged
 * @param mergeFunction function that merges two properties, e.g. shallowMerge, deepMerge, etc.
 * @returns copy of the merged property, doesn't mutate nodes
 */
// todo: make tail call recursive
export function walkChainMerge({
    startNode,
    linkName,
    mergeProperty,
    mergeFunction
}: {
    startNode: NodeMerge;
    linkName: string;
    mergeProperty: string;
    mergeFunction: (nodeOne: unknown, nodeTwo: unknown) => unknown;
}): unknown {
    function recursion(node: NodeMerge, visitedNodes: NodeMerge[]) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        // get local data that's merged
        // may be undefined, check later
        const localProperty = node[mergeProperty];

        const nextNode = node[linkName];

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return localProperty;
        }

        // linked node doesn't exists, stop here
        // doesn't matter if localProperty is undefined because as left-most value in mergeFunction() gets merged away
        if (nextNode === undefined) {
            return localProperty;
        }
        
        // linked node exists, go deeper
        else {
            // ignore local data if undefined
            if (localProperty === undefined) {
                return recursion(nextNode, visitedNodes);
            } else {
                return mergeFunction(recursion(nextNode, visitedNodes), localProperty);
            }
        }
    }

    return recursion(startNode, []);
}

/**
 * Walks along chain of linked nodes.
 * For each node executes a callback function.
 * Stops at node which doesn't have another linked node or whose linked node doesn't exist.
 * @param startNode node from which to start walking
 * @param nodeList list in which to search for the linked node
 * @param linkName property name that contains ID of linked node
 * @param idName property name that contains ID of a node
 * @param callback function executed for each node, is passed the current node, the return value of the previous callback, and the data argument
 * @param data optional argument passed through to every callback function
 * @returns return value of last callback
 * Note: the value of `idName` of nodes in the `nodeList` is assumed to be unique.
 */
export function walkChainIdCallSync<U extends unknown>({
    startNode,
    nodeList,
    linkName,
    idName,
    callback,
    data
}: {
    startNode: NodeId;
    nodeList: NodeId[];
    linkName: string;
    idName: string;
    callback: (node: NodeId, lastValue: U, data: unknown) => U;
    data?: unknown;
}): U {
    function recursion(node: NodeId, lastValue: U, visitedNodes: NodeId[], data: unknown) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        const returnValue = callback(node, lastValue, data);

        // node doesn't have linked node, stop here
        // (otherwise find() will return the next node without an idName)
        if (node[linkName] === undefined) {
            return returnValue;
        }

        // can choose first match because value of idName of nodes in nodeList is unique
        const nextNode = nodeList.find(nd => nd[idName] == node[linkName]);

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return returnValue;
        }

        // linked node doesn't exists, stop here
        if (nextNode === undefined) {
            return returnValue;
        }
        
        // linked node exists, go deeper
        else {
            return recursion(nextNode, returnValue, visitedNodes, data);
        }
    }

    return recursion(startNode, undefined, [], data);
}

export async function walkChainIdCall<U extends unknown>({
    startNode,
    nodeList,
    linkName,
    idName,
    callback,
    data
}: {
    startNode: NodeId;
    nodeList: NodeId[];
    linkName: string;
    idName: string;
    callback: (node: NodeId, lastValue: U, data: unknown) => Promise<U>;
    data?: unknown;
}): Promise<U> {
    async function recursion(node: NodeId, lastValue: U, visitedNodes: NodeId[], data: unknown) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        const returnValue = await callback(node, lastValue, data);

        // node doesn't have linked node, stop here
        // (otherwise find() will return the next node without an idName)
        if (node[linkName] === undefined) {
            return returnValue;
        }

        // can choose first match because value of idName of nodes in nodeList is unique
        const nextNode = nodeList.find(nd => nd[idName] == node[linkName]);

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return returnValue;
        }

        // linked node doesn't exists, stop here
        if (nextNode === undefined) {
            return returnValue;
        }
        
        // linked node exists, go deeper
        else {
            return recursion(nextNode, returnValue, visitedNodes, data);
        }
    }

    return await recursion(startNode, undefined, [], data);
}

/**
 * Walks along chain of linked nodes.
 * Merges the specified property over all linked nodes, earlier from start node overwrite later towards root node.
 * Stops at node which doesn't have another linked node or whose linked node doesn't exist.
 * Doesn't merge in property if undefined.
 * @param startNode node from which to start walking
 * @param nodeList list in which to search for the linked node
 * @param linkName property name that contains ID of linked node
 * @param idName property name that contains ID of a node
 * @param mergeProperty property name that is merged
 * @param mergeFunction function that merges two properties, e.g. shallowMerge, deepMerge, etc.
 * @returns copy of the merged property, doesn't mutate nodes
 * Note: the value of `idName` of nodes in the `nodeList` is assumed to be unique.
 */
// todo: make tail call recursive
export function walkChainIdMerge({
    startNode,
    nodeList,
    linkName,
    idName,
    mergeProperty,
    mergeFunction
}: {
    startNode: NodeIdMerge;
    nodeList: NodeIdMerge[];
    linkName: string;
    idName: string;
    mergeProperty: string;
    mergeFunction: (nodeOne: unknown, nodeTwo: unknown) => unknown;
}): unknown {
    function recursion(node: NodeIdMerge, visitedNodes: NodeIdMerge[]) {
        // record visited node for cyclical dependency check
        visitedNodes.push(node);

        // get local data that's merged
        // may be undefined, check later
        const localProperty = node[mergeProperty];

        // node doesn't have linked node, stop here
        // (otherwise find() will return the next node without an idName)
        // doesn't matter if localProperty is undefined because as left-most value in mergeFunction() gets merged away
        if (node[linkName] === undefined) {
            return localProperty;
        }

        // can choose first match because value of idName of nodes in nodeList is unique
        const nextNode: NodeIdMerge | undefined = nodeList.find(nd => nd[idName] == node[linkName]);

        // has cyclical dependency, stop here
        if (visitedNodes.includes(nextNode)) {
            return localProperty;
        }

        // linked node doesn't exists, stop here
        // doesn't matter if localProperty is undefined because as left-most value in mergeFunction() gets merged away
        if (nextNode === undefined) {
            return localProperty;
        }

        // linked node exists, go deeper
        else {
            // ignore local data if undefined
            if (localProperty === undefined) {
                return recursion(nextNode, visitedNodes);
            } else {
                return mergeFunction(recursion(nextNode, visitedNodes), localProperty);
            }
        }
    }

    return recursion(startNode, []);
}
