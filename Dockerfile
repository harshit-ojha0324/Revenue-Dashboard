# Backend build stage
FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json ./
COPY server ./server
RUN npm install --only=production
EXPOSE 5001
CMD ["node", "server/index.js"]

# Frontend build stage
FROM node:16-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Frontend runtime stage
FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]