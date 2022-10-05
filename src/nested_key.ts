/*
 * Get nested property from object
*/
export function deepGet(object: object, key: string[]): unknown {
  const [head, ...rest] = key;

  if (rest.length) {
    return deepGet(object[head], rest);
  } else {
    return object[head];
  }
}

/*
 * Set nested property on object
 * can force if parent properties don't exist
*/
export function deepSet(object: object, key: string[], value: unknown, force = false): void {
  const [head, ...rest] = key;

  if (rest.length) {
    if (!object[head] && force) {
      object[head] = {}
    }
    deepSet(object[head], rest, value, force);
  } else {
    object[head] = value;
  }
}