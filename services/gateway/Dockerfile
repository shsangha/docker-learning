FROM node:10.10.0

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY . /usr/src/app/
RUN npm install --silent

# start app change this to the prod command after
CMD ["npm", "run","start"]