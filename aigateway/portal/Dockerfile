# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_ADMIN_URL=http://101.200.198.113:8088
ENV VITE_ADMIN_URL=$VITE_ADMIN_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
