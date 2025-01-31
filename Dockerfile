# Stage 1: Build the frontend
FROM node:18 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости внутри контейнера
RUN npm install

# Копируем весь исходный код в контейнер
COPY . .

# Собираем проект
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine

# Копируем собранный проект в контейнер
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80 для nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
