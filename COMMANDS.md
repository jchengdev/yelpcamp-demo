# SCRIPTS

## DEV

$ BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") COMMIT=$(git rev-parse --short HEAD) docker-compose up -d

## PROD (HEROKU CONTAINER)

$ docker build -t jchengdeveng/yelpcamp-ejs:latest --target=prod --build-arg BUILD_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")" --build-arg SOURCE_COMMIT="$(git rev-parse --short HEAD)" -f ./Dockerfile .
$ docker tag jchengdeveng/yelpcamp-ejs:latest registry.heroku.com/yelpcamp-ejs-82627/web
$ docker push registry.heroku.com/yelpcamp-ejs-82627/web
$ heroku container:release web
