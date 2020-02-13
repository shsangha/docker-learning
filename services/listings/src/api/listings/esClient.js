const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'http://elasticsearch:9200',
  log: 'trace',
  apiVersion: '5.6'
});

module.exports = client;
 