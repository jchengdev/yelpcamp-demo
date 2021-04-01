FROM mongo:4.4.4

ENV MONGO_DB=db-docker
ENV DATABASE_NAME=yelpcamp_123
ENV ADMIN_USER=admin
ENV ADMIN_PASS=admin
ENV DB_USER=username
ENV DB_PASS=password

COPY . .
# ? <TODO> sed mongo_shell.js for hardcoded DB_USER, DB_PASS and DATABASE_NAME
RUN  chmod -R 777 ./setup.sh
CMD [ "/bin/sh", "-c", "./setup.sh ${MONGO_DB} ${DATABASE_NAME} ${ADMIN_USER} ${ADMIN_PASS} ${DB_USER} ${DB_PASS}" ]
