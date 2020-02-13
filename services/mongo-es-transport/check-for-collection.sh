#!/bin/bash

#mongo wont tail the oplog if there are no collections in the DB, so this this script is needed if using a fresh mongo volume 

res=$(mongo listings --host rs0/listing-db:27017 -u shawn -p shawn --authenticationDatabase admin --quiet  --eval 'db.getCollectionNames().indexOf("listings")')

status=${res: -2}

if [[ "$status" == "-1" ]]; then
  # Replicaset not yet configured
  mongo listings --host rs0/listing-db:27017 -u shawn -p shawn --authenticationDatabase admin --eval 'db.createCollection("listings")';
fi

