/*
 * Get nested property from object
 * key can be an array of strings or a string
 * can specify separator for string, e.g. "name.first"
*/
export function get(object: object, key: string[] | string, separator: string = "."): unknown {
  const [head, ...rest] = Array.isArray(key) ? key : key.split(separator);

  if (rest.length) {
    return get(object[head], rest.join("."));
  } else {
    return object[head];
  }
}

/*
 * Set nested property on object
 * key can be an array of strings or a string
 * can specify separator for string, e.g. "name.first"
 * Beware: parent properties must exist!
*/
export function set(object: object, key: string[] | string, value: unknown, separator: string = "."): void {
  const [head, ...rest] = Array.isArray(key) ? key : key.split(separator);

  if (rest.length) {
    set(object[head], rest.join("."), value);
  } else {
    object[head] = value;
  }
}