FROM node:10.10.0

RUN apt-get update -qq
RUN apt-get install -y build-essential
RUN apt-get install -y git

RUN git init
# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY ./package.json /usr/src/app/package.json
RUN npm install --silent

COPY .  /usr/src/app

# start app change this to the prod command after
CMD ["npm", "run","start"]

