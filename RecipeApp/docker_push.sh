#!/bin/bash

# Vérifier si le nom de l'image et le tag sont fournis
if [ -z "$1" ]; then
  echo "Usage: $0 <tag>"
  exit 1
fi

# Variables
IMAGE_NAME="recipe-app"
TAG=$1
DOCKER_USERNAME="llsun"  # Remplacez par votre nom d'utilisateur Docker Hub

# Construire l'image Docker
echo "Construction de l'image $IMAGE_NAME:$TAG..."
docker build -t $IMAGE_NAME:$TAG .

# Taguer l'image avec le nouveau tag et latest
echo "Taggage de l'image..."
docker tag $IMAGE_NAME:$TAG $DOCKER_USERNAME/$IMAGE_NAME:$TAG
docker tag $IMAGE_NAME:$TAG $DOCKER_USERNAME/$IMAGE_NAME:latest

# Pousser les deux tags
echo "Push des tags vers Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest

echo "L'image a été poussée avec les tags '$TAG' et 'latest'."
