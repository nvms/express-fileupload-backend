FROM  node:8
   
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package.json /usr/src/app/

RUN npm install
RUN apt-get update
RUN apt-get install nano

COPY ./dist /usr/src/app/dist

EXPOSE 3005

ENV BYTERESTRICTOR '10485760'


CMD [ "npm", "run", "prod" ]