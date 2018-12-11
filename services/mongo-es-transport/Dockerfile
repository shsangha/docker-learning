FROM mongo:4.0-xenial

# SET ENV VARIABLES AT THE TOP HERE
ENV DB_NAME grailed

ENV MONGODB_URI mongodb://shawn:shawn@mongo:27017/grailed?authSource=admin

ENV ELASTICSEARCH_URI http://elasticsearch:9200

#update and download wget so we can dl transporter
RUN  apt-get update \
  && apt-get install -y \
  wget \
  curl \
  sudo \
  netcat \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && sudo apt-get install --only-upgrade bash

#download from github 
RUN wget https://github.com/compose/transporter/releases/download/v0.5.2/transporter-0.5.2-linux-amd64

#reloacted to bin directory
RUN mv transporter-*-linux-amd64 /usr/local/bin/transporter

#make executable 
RUN chmod +x /usr/local/bin/transporter

COPY ./pipeline.js .
COPY ./priceFilterTransform.js .
COPY ./wait-for.sh .
COPY ./wait-for-then.sh .
COPY ./wait-for-repl.sh .
COPY ./check-for-collection.sh .

ENTRYPOINT ./wait-for-then.sh
