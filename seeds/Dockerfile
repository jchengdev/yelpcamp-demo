FROM mongo:4.4.4

ENV MONGO_DB=db-docker
ENV DATABASE_NAME=yelpcamp_123
ENV USERNAME=username
ENV PASSWORD=password

COPY . .
RUN  chmod -R 777 ./mongo_import.sh
CMD [ "/bin/sh", "-c", "./mongo_import.sh ${MONGO_DB} ${DATABASE_NAME} ${USERNAME} ${PASSWORD}" ]
