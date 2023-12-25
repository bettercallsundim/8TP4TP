/**
 * @param {string} s
 * @return {boolean}
 */

var isValid = function (s) {
  for (let i = 0; i < s.length; i++) {
    if (s[i] == "(") {
      for (let j = i + 1; j < s.length; j++) {
        if (s[j] == ")") {
          s = s.slice(i+1, i + 2);
          // console.log(s);
          s = s.slice(j, j+1);
          // console.log(s);

          break;
        }
      }
    } else if (s[i] == "{") {
      for (let j = i + 1; j < s.length; j++) {
        if (s[j] == "}") {
          s = s.slice(i, i + 1);
          s = s.slice(j - 1, j);
          break;
        }
      }
    } else if (s[i] == "[") {
      for (let j = i + 1; j < s.length; j++) {
        if (s[j] == "]") {
          s = s.slice(i, i + 1);
          s = s.slice(j - 1, j);
          break;
        }
      }
    }
  }
  // console.log(s);
  if (s == "") {
    // console.log(1);
    return 1;
  } else {
    // console.log(0);
    return 0;
  }
};
isValid("()");
