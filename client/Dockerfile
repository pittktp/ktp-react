# A file that packages the frontend into a Docker image to be run as a container in AWS -> used for deployment
# Also packages nginx using the nginx.conf file which is used as the webserver for our website into a Docker image to be run as a container -> used for deployment

# Stage 1 - the frontend React image
FROM node:8 as builder
WORKDIR /react_app
ENV PATH /react_app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./

# Set environment variables
ARG REACT_APP_API
ENV REACT_APP_API ${REACT_APP_API}
ARG REACT_APP_REGISTER_CODE
ENV REACT_APP_REGISTER_CODE ${REACT_APP_REGISTER_CODE}
ARG REACT_APP_REGISTER_ADMIN_CODE
ENV REACT_APP_REGISTER_ADMIN_CODE ${REACT_APP_REGISTER_ADMIN_CODE}

RUN yarn build

# Stage 2 - the Nginx webserver image
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /react_app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]