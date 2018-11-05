#!/bin/bash

#mongo wont tail the oplog if there are no collections in the DB, so this this script is needed if using a fresh mongo volume 

status=$(mongo listings --host listingDB:27017 -u root -p root --authenticationDatabase admin  --eval 'db.getCollection('listings')')
if [ $? -ne 0 ]; then
  # Replicaset not yet configured
  mongo listings --host rs0/listingDB:27017 -u root -p root --authenticationDatabase admin --eval 'db.createCollection("listings")';
fi