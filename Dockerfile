FROM node:lts-slim

USER node

WORKDIR /home/node

COPY --chown=node:node . .

RUN npm ci

ENTRYPOINT [ "node" ]
CMD [ "./main.js" ]
