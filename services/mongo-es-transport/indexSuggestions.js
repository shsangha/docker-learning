/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */

/* function to add the suggestion options to es since there is not need to store them in mongo
  @param {Object} [doc] - the changes object coming in from Mongo
  @returns {Object} the changes object with suggestions appended for elasticsearch
  
*/

var suggestions;
function transform(doc) {
  //adds designer suggestions
  if (doc['data']['designer']) {
    doc['data']['designer_suggestions'] = doc['data']['designer'];
  }

  // adds every word as an input to suggesters, stop words will be discarded by the stop analyzer i plugged in
  if (doc['data']['name']) {
    suggestions = doc['data']['name'].split(' ');

    doc['data']['name_suggestions'] = suggestions;
  }

  return doc;
}
