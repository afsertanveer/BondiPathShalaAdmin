export function subtractHours(date) {
    date.setHours(date.getHours() - 6);
  
    return date;
  }

  export function isEmptyObject(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }