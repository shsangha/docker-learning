#!/bin/bash



IP=$(curl -I --write-out "%{http_code}" --silent --output /dev/null http://elasticsearch:9200/listings)



if [[ "$IP" -eq 404 ]]; then
  
  curl -X PUT "http://elasticsearch:9200/listings" -H 'Content-Type: application/json' -d'

elif [[ "$IP" -eq 200 ]]; then
  echo "INDEX EXISTS DOING NOTHING"

else 
  echo "ERROR DID NOT CONNECT TO ELASTIC PROPERLY"
fi

