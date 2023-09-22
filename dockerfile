FROM alpine
RUN apk add --update nodejs npm
WORKDIR /app/HalifaxFoodie
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]