FROM node:18.18.0 AS builder
RUN mkdir -p /app
WORKDIR /app
ADD . .
RUN mkdir -p video-storage

RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN yarn install
RUN yarn run build

ARG STAGE
ENV STAGE ${STAGE}
ARG POSTGRES_HOST
ENV POSTGRES_HOST ${POSTGRES_HOST}
ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}
ARG SLACK_WEBHOOK
ENV SLACK_WEBHOOK ${SLACK_WEBHOOK}
ARG GOOGLE_EMAIL_USER
ENV GOOGLE_EMAIL_USER ${GOOGLE_EMAIL_USER}
ARG GOOGLE_EMAIL_PASSWORD
ENV GOOGLE_EMAIL_PASSWORD ${GOOGLE_EMAIL_PASSWORD}
ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET}
ARG SWAGGER_USER
ENV SWAGGER_USER ${SWAGGER_USER}
ARG SWAGGER_PASSWORD
ENV SWAGGER_PASSWORD ${SWAGGER_PASSWORD}

CMD yarn run typeorm migration:run;yarn run start:prod