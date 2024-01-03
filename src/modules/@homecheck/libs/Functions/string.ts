function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export const replaceAll = (text: string, oldValue: string, newValue: string) => {
  return text.replace(new RegExp(escapeRegExp(oldValue), "g"), newValue);
  //return _.replace(text, new RegExp(oldValue, "g"), newValue)
}
