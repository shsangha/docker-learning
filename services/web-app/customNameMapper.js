idObj = new Proxy(
  {},
  {
    get: (target, key) => {
      if (key === "__esModule") {
        return false;
      }
      console.log(key);
      return key;
    }
  }
);

module.exports = idObj;
