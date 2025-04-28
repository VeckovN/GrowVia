#downgrade from node:23 to node:20 to avoid bycrypt library error (because it isn't supported well in v.23)
FROM node:20-alpine3.20 AS builder

WORKDIR /app 

#we want to use whatever we have in package-lock.json
#we copy package.json and package-lock.json with '*' simbol 
#wiht package* -> takes package*'anything' -> package and package-lock
COPY package*.json ./  
#COPY package.json ./ 
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install -g npm@latest 
#when the 'npm i' and only copied package.json -> on every build the packages will reinstalled
#RUN npm i & npm run build

#now use "ci" instead of 'i' -> because we copied the package-lock.json as well 
RUN npm ci && npm run build

FROM node:20-alpine3.20

WORKDIR /app
RUN apk add --no-cache curl
#COPY package.json ./ 
COPY package*.json ./ 
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest 
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4000

CMD ["npm", "run", "start"]