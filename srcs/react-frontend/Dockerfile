FROM node:alpine AS development

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

# RUN npm install glob rimraf

# RUN npm install --only=development
RUN npm install 

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

# RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# RUN npm install -g serve

CMD npm run build && serve -s build
