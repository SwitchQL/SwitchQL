function toTitleCase(str) {
  let transformed = str[0].toUpperCase();
  transformed += str.slice(1).toLowerCase();
  return transformed;
}

module.exports = {
  toTitleCase
};
