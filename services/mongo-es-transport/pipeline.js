var source = mongodb({
  uri: 'mongodb://root:root@listing-db:27017/listings?authSource=admin',
  tail: true,
  timeout: '60s',
  bulk: false
});

var sink = elasticsearch({
  uri: 'http://elasticsearch:9200/listings',
  timeout: '60s'
});
// prettier-ignore
t.Source('source', source, '/.*/')
.Transform(omit({"fields": ["description", "photos", "accept_offers", "comments", "buy_now", "shipping"]}))
.Transform(goja({"filename":"priceFilterTransform.js"}))
.Transform(goja({"filename": "indexSuggestions.js"}))
.Save('sink', sink, '/.*/');
