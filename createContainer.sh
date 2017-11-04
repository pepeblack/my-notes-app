#!/bin/bash

export DOCKER_ID_USER="pepeblack"

# create new image
docker build -t $DOCKER_ID_USER/my-notes-app .

# login on docker cloud
docker login

# tag image
docker tag my-notes-app $DOCKER_ID_USER/my-notes-app:latest

# uplpad image
docker push $DOCKER_ID_USER/my-notes-app:latest

