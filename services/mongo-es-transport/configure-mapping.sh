#!/bin/bash



IP=$(curl -I --write-out "%{http_code}" --silent --output /dev/null http://elasticsearch:9200/listings)



if [[ "$IP" -eq 404 ]]; then
  
  curl -X PUT "http://elasticsearch:9200/listings" -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2,
            "analysis": {
              "analyzer": {
                "custom_analyzer": {
                  "type": "custom",
                  "tokenizer": "lowercase",
                  "char_filter": [],
                  "filter": [
                    "asciifolding",
                    "trim"
                  ]
                }
              }
            }
        }    
    },
    "mappings": {
      "listings": {
        "properties": {
          "name": {"type": "text", "analyzer": "custom_analyzer"},
          "designer": {"type": "keyword"},
          "category": {"type": "keyword"},
          "size": {"type": "keyword"},
          "price": {"type": "scaled_float", "scaling_factor":100},
          "location": {"type": "keyword"},
          "market": {"type": "keyword"},
          "posted": {"type": "date"},
          "views": {"type": "integer"},
          "wanted": {"type": "integer"},
          "designer_suggestions": {"type": "completion","contexts": [{"name": "status", "type": "category", "path": "status"}] , "analyzer": "simple"},
          "name_suggestions": {"type": "completion", "contexts": [{"name": "status", "type": "category", "path": "status"}] ,"analyzer": "stop"}
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

