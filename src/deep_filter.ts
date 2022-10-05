/*
 * Filter array of object property or that don't contain nested value
 * beware: recursive!
*/
export function deepFilter(obj, key, testFn) {
  const [head, ...rest] = key;
  
   // assumes is object or array
  if (key.length) {
  
    if (Array.isArray(obj)) {
      const res = obj
        .map(e => deepFilter(e, key, testFn))
        .filter(e => e !== undefined);
        
      return res.length != 0 ? res : undefined;
    } else {
      const val = deepFilter(obj[head], rest, testFn);

      return val !== undefined ? { ...obj, [head]: val } : undefined;
    }
    
  // assumes is primitive value or array
  } else {
  
    if (Array.isArray(obj)) {
      const res = obj.filter(e => testFn(e));
      return res.length != 0 ? res : undefined;
    } else {
      return testFn(obj) ? obj : undefined;
    }
    
  }
}
