var source = mongodb({
  uri: 'mongodb://root:root@listingDB:27017/listings?authSource=admin',
  tail: true,
  timeout: '30s',
  bulk: false
});

var sink = elasticsearch({
  uri: 'http://elasticsearch:9200/listings',
  timeout: '30s'
});
// prettier-ignore
t.Source('source', source, '/.*/').Transform(goja({"filename":"priceFilterTransform.js"})).Transform(omit({"fields": ["likes", "description", "photos", "accept_offers", "comments", "sold", "buy_now", "shipping"]})).Save('sink', sink, '/.*/');
