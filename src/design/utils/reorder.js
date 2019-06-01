/*
 * Utility to reorder list
 * Scans the list only once.
 */
export default function reorder (array, fromIndex, toIndex) {
  var lastIndex = array.length - 1 
  var firstIndex = 0
  var result = new Array(array.length)
  var tmp

  if (fromIndex === toIndex) {
    return
  }

  if (fromIndex < toIndex) {
    for(let i = firstIndex; i <lastIndex; i++) {
      if ( i === fromIndex) {
        tmp = array[i];
      } else if (i > fromIndex && i <toIndex) {
        result[i -1] = array[i]
      } if (i === toIndex) {
        result[i - 1] = array[i]
        result[i] = tmp
      } else {
        result[i] = array[i]
      }
    }
  } else {
    for (let i = lastIndex; i >= firstIndex; i--) {
      if ( i === fromIndex ) {
        tmp = array[i]
      } else if ( i < fromIndex && i > toIndex) {
        result[i + 1] = array[i]
      } else if (i === toIndex) {
        array[i] = tmp
        result[i + 1] = array[i]
      } else { 
        result[i] = array[i]
      }
    }
  }
  return result
}