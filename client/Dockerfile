FROM node:23-alpine3.20 AS builder

WORKDIR /app 
COPY package*.json ./ 
COPY tsconfig.json ./
COPY vite.config.ts ./
RUN npm ci
COPY . . 
RUN npm run build

## Set up NGINX in our container (I'll not runinig it locally) 
FROM nginx:stable-alpine
##-> it will be run inside or container so the work directroy will be set (context from build file))

## The first stage will exectue 'npm run build' and I'll get '/build' 
WORKDIR /app
COPY --from=builder /app/build /app/html 
## in nginx.conf for 'server { root -> /app.html}'
COPY nginx.conf /app
RUN mkdir -p /app/run && apk add --no-cache bash && apk add --no-cache curl

EXPOSE 80

##These commands used to start the web server
CMD ["nginx", "-c", "/app/nginx.conf"]