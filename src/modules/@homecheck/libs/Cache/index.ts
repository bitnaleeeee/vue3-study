export const setCache = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const getCache = (key: string) => {
    return window.localStorage.getItem(key);
}

export const actionWithCache = (key: string, action: (val: string) => void) => {
  const _recycle = getCache(key);
  if (_recycle) {
    action(_recycle);
  }
};
