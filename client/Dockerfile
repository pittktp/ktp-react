# A file that packages the frontend into a Docker image to be run as a container in AWS -> used for deployment
# Also packages nginx using the nginx.conf file which is used as the webserver for our website into a Docker image to be run as a container -> used for deployment

# Stage 1 - the frontend React image
FROM node:8 as builder
COPY ./ /react_app
WORKDIR /react_app
RUN yarn install
RUN yarn build

# Stage 2 - the Nginx webserver image
FROM nginx:alpine
RUN rm -f /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /react_app/build/* /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]