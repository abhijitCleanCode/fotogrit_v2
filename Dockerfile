FROM node:16.16.0-alpine

ARG VITE_PRODUCTION
ARG VITE_SERVER

ENV VITE_PRODUCTION=$VITE_PRODUCTION
ENV VITE_SERVER=$VITE_SERVER

# set working directory
WORKDIR /app

# Clean install of dependencies
COPY package.json package-lock.json ./

# Update npm and clear cache
RUN npm install -g npm@9.6.5 \
    && npm cache clean --force

# Install dependencies with clean slate
RUN rm -rf node_modules \
    && npm install --legacy-peer-deps \
    && npm install vite --legacy-peer-deps

# add app
COPY . .

RUN cp .env.example .env

EXPOSE 5173

# start app
CMD ["npm", "run", "dev", "--", "--host"]
