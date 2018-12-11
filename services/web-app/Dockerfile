FROM node:latest

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app
COPY . /usr/src/app/
RUN npm install --silent
RUN npm rebuild node-sass
# start app
CMD ["npm", "run","dev"]