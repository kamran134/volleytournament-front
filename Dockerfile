# 1. Строим Angular приложение
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g @angular/cli && npm install --omit=dev

COPY . .
RUN npm run build --configuration=production

# 2. Запускаем с Nginx
FROM nginx:alpine

# Копируем собранный Angular frontend в Nginx
COPY --from=build /app/dist/education-system-front /usr/share/nginx/html

EXPOSE 80