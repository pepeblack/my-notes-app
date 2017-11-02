FROM node:latest

# Create app directory
WORKDIR /app

EXPOSE 8080

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]