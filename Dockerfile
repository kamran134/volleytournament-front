# Шаг 1: Используем node:18 для сборки проекта
FROM node:18 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Строим проект для продакшн-режима
RUN npm run build --configuration=production

# Шаг 2: Используем Nginx для хостинга статических файлов
FROM nginx:alpine

# Копируем собранные файлы Angular в Nginx
COPY --from=build /app/dist/education-system-frontend /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
