# Используем Node.js для сборки Angular-приложения
FROM node:18 AS build

WORKDIR /app

# Копируем package.json (без package-lock.json, если его нет)
COPY package.json ./

# Генерируем package-lock.json, если его нет
RUN npm install --package-lock-only

# Копируем package-lock.json и устанавливаем зависимости
COPY package-lock.json ./
RUN npm install --omit=dev

# Копируем весь проект
COPY . .

# Собираем Angular-приложение в режиме production
RUN npm run build --configuration=production

# Используем Nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранные файлы Angular в Nginx
COPY --from=build /app/dist/education-system-frontend /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
