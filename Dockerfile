FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

# pm2설치
RUN npm install --global pm2
RUN npm install

COPY . .

RUN npm run start:prod

FROM node:18-alpine as production

ARG NODE_ENV=prod
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app

COPY package*.json ./

# pm2설치
RUN npm install --global pm2
RUN npm install --only=prod

COPY . .
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3000
# pm2-runtime으로 실행
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "prod"]

#CMD [ "node", "dist/main.js" ]
