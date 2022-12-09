
export function debounce(callback, timeout = 500) {
  let timeoutId;

  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
