const escapeCharRegEx = /["\\\n\r]/;
const escapeCharRegExAll = /["\\\n\r]/g;

const replacer = (char: string) => {
  switch (char) {
    case `"`:
      return `\\"`;
    case `\\`:
      return `\\\\`;
    case `\n`:
      return `\\n`;
    case `\r`:
      return `\\r`;
    default:
      return char; // this should never happen
  }
};

export const escape = (value: string) => {
  if (escapeCharRegEx.test(value)) {
    return value.replace(escapeCharRegExAll, replacer);
  }

  return value;
};
