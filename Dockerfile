FROM node:14
WORKDIR /usr/src/app

RUN yarn global add typescript
RUN yarn global add forever
