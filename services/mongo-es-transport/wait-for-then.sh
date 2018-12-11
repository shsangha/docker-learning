#!/bin/bash

# Waits for the mongodb service then waits for the elasticsearch service, then starts the transporter
# The services are tested via trying to connect to the host and port defined by the environment variables.


export EPORT=9200
export EHOST=elasticsearch

export MPORT=27017
export MHOST=listing-db

echo "Waiting for ${MHOST}:${MPORT} ..." && \
    ./wait-for.sh "$MHOST:$MPORT" -t 60 -- \
    echo "Waiting for Mongo replication..." && \
    ./wait-for-repl.sh
    echo "Checking if the collection exists..." && \
    ./check-for-collection.sh
    echo "Waiting for ${EHOST}:${EPORT} ..." && \
    ./wait-for.sh "$EHOST:$EPORT" -t 60 -- \
    transporter run -log.level "debug" pipeline.js