//todo: improve types

/**
 * Searches down a tree for a node
 * Returns first node whose key matches value
 * Returns undefined if no node is found
 * Note: The search is depth first, not breadth first.
 * @param {object} tree tree to search
 * @param {string} key name of key that is compared
 * @param {string|number} value value of key that must match
 * @param {string} childrenKey name of key that contains array of child trees
 */
export function searchTree(tree, key, value, childrenKey) {
  if (tree[key] === value) {
    return tree;
  }

  const children = tree[childrenKey];

  if (children?.length) {
    let result;
    for (const child of children) {
      if (result !== undefined) {
        break;
      } else {
        result = searchTree(child, key, value, childrenKey);
      }
    }
    return result;
  }
}
