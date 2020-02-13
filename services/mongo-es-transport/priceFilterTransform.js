/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
function transform(doc) {
  if (doc['data']['price']) {
    doc['data']['price'] = doc['data']['price'][0];
  }

  return doc;
}
