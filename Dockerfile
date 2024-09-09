#stage 2
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/
COPY dist/mjales-web-app/browser /usr/share/nginx/html/mjalisweb