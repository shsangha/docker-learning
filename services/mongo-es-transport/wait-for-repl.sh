#!/bin/bash


status=$(mongo admin --host listing-db:27017 -u root -p root --authenticationDatabase admin  --eval 'rs.status().members.length')
if [ $? -ne 0 ]; then
  # Replicaset not yet configured
  mongo listings --host listing-db:27017 -u root -p root --authenticationDatabase admin --eval 'rs.initiate({ _id: "rs0", version: 1, members: [ { _id: 0, host : "listing-db:27017" } ] })';
fi