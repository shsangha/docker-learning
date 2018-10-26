var source = mongodb({
  "uri": "mongodb://root:root@mongo:27017/grailed?authSource=admin",
  "tail": true,
  "timeout": "30s",
  "bulk": false,
});


var sink = elasticsearch({
  "uri": "http://elasticsearch:9200/grailed",
  "timeout": "30s"
});

t.Source("source",source, "/.*/").Save("sink",sink,"/.*/");

