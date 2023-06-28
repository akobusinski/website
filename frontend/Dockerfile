FROM node:18-alpine AS build

WORKDIR /app
COPY . ./
RUN npm ci
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /var/www/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]
