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

t.Source('source', source, '/.*/').Save('sink', sink, '/.*/');
