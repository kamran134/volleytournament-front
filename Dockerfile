# Используем Node.js для сборки Angular-приложения
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости (включая dev-зависимости)
RUN npm install -g @angular/cli && npm install --omit=dev

# Копируем исходный код
COPY . .

# Запускаем сборку Angular
RUN npm run build --configuration=production

# Используем Nginx для раздачи фронтенда
FROM nginx:alpine

# Копируем собранный проект в Nginx
COPY --from=build /app/dist/education-system-frontend /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
