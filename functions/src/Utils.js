const makeid = (len) => {
  var text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const isOdd = num => { return num % 2; }

module.exports = {
  isOdd,
  makeid,
};
