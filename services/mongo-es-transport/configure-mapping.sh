#!/bin/bash



IP=$(curl -I --write-out "%{http_code}" --silent --output /dev/null http://elasticsearch:9200/listings)



if [[ "$IP" -eq 404 ]]; then
  
  curl -X PUT "http://elasticsearch:9200/listings" -H 'Content-Type: application/json' -d'
{
    "settings" :  {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2,
            "analysis": {
              "tokenizer": {},
              "filter": {
                "autocomplete_filter": {
                  "type": "edge_ngram",
                  "min_gram": "1",
                  "max_gram": "25"
                }
            },
            "char_filter": {},
            "analyzer": {
               "autocomplete_analyzer": {
                "type": "custom",
                "tokenizer": "lowercase",
                "char_filter": [],
                "filter": [
                  "asciifolding",
                  "trim",
                  "autocomplete_filter"
                ]
              }
            }
          }
        }    
    },
    "mappings": {
      "listings": {
        "properties": {
          "name": {"type": "text", "fields":{"raw": {"type": "keyword"}}, "analyzer": "autocomplete_analyzer", "search_analyzer": "standard"},
          "designer": {"type": "text", "fields": {"raw": {"type": "keyword"}}, "analyzer": "autocomplete_analyzer", "search_analyzer": "standard", "boost": "1.4" },
          "category": {"type": "keyword"},
          "size": {"type": "keyword"},
          "price": {"type": "scaled_float", "scaling_factor":100},
          "location": {"type": "keyword"},
          "market": {"type": "keyword"},
          "posted": {"type": "date"},
          "views": {"type": "integer"},
          "wanted": {"type": "integer"},
          "status": {"type": "keyword"}
        }
      }
    }
}
'
elif [[ "$IP" -eq 200 ]]; then
  echo "INDEX EXISTS DOING NOTHING"

else 
  echo "ERROR DID NOT CONNECT TO ELASTIC PROPERLY"
fi

