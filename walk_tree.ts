type Tree = {
    [index: string]: Tree;
};

/**
 * Walks down a tree.
 * For each node in tree executes a callback function.
 * The argument of the callback function is the node that it is executed on and its key.
 * @param tree tree to walk down
 * @param callback callback function to execute for each node
 */
// return only for tail call optimisation
export function walkTreeCall(tree: Tree, callback: (tree: Tree, key: string) => void): void {
    return Object.keys(tree).forEach(nodeName => {
        const node = tree[nodeName];
        callback(node, nodeName);
        walkTreeCall(node, callback);
    });
}

/**
 * Walks down a tree.
 * For each leaf node in tree executes a callback function.
 * The argument of the callback function is the node that it is executed on and its key.
 * @param tree tree to walk down
 * @param callback callback function to execute for each leaf node
 * @param treeName key of tree (optional, needs only internally for recursion)
 */
// return only for tail call optimisation
export function walkTreeLeafCall(tree: Tree, callback: (tree: Tree, key: string) => void, treeName?: string): void {
    const nodeNames = Object.keys(tree);

    // has children
    if (nodeNames.length > 0) {
        return nodeNames.forEach(nodeName => {
            walkTreeLeafCall(tree[nodeName], callback, nodeName);
        });
    }

    // has no children, i.e. is leaf
    else {
        return callback(tree, treeName);
    }
}

/**
 * Walks down two trees and compares them.
 * For each node in tree one that is not in tree two executes a callback function.
 * The argument of the callback function is the node that it is executed on and its key.
 * @param tree1 tree one to walk down
 * @param tree2 tree two to compare with
 * @param callbackIfDifferent callback function to execute for each node in tree one that is not in tree two
 * @param leafOnly true if callback function is only executed on leaf nodes of subtree
 */
// return only for tail call optimisation
export function walkTreeCompare(tree1, tree2, callbackIfDifferent, leafOnly) {
    Object.keys(tree1).forEach(node1Key => {
        // same node in tree two
        const node2 = tree2[node1Key];
        // actual node in tree one
        const node1 = tree1[node1Key];

        // good, this one exists, but what about the children?
        if (node2) {
            return walkTreeCompare(node1, node2, callbackIfDifferent, leafOnly);
        }

        // bad, this one doesn't exist
        else {
            if (leafOnly) {
                return walkTreeLeafCall(node1, callbackIfDifferent);
            } else {
                callbackIfDifferent(node1, node1Key);
                // all child nodes don't exist as well
                return walkTreeCall(node1, callbackIfDifferent);
            }
        }
    });
}