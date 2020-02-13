const groupValidationErrors = e => {
  return Object.keys(e).reduce((messageObj, currentErr) => {
    // the side-effect is contained within the reduce function so this is fine
    // eslint-disable-next-line no-param-reassign
    messageObj[currentErr] = e[currentErr].message;
    return messageObj;
  }, {});
};

module.exports = groupValidationErrors;
