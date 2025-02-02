# Используем Node.js для сборки Angular-приложения
FROM node:18 AS build

WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install && npm install -g @angular/cli

# Копируем весь проект
COPY . .

# Собираем проект
RUN ng build --configuration=production

# Используем Nginx
FROM nginx:alpine

# Копируем файлы Angular в Nginx
COPY --from=build /app/dist/education-system-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
