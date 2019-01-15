/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */

var suggestions;
function transform(doc) {
  if (doc['data']['status']) {
    if (doc['data']['designer']) {
      doc['data']['designer_suggestions'] = doc['data']['designer'];
    }

    if (doc['data']['name']) {
      suggestions = doc['data']['name'].split(' ');

      doc['data']['name_suggestions'] = suggestions;
    }
  }

  return doc;
}
