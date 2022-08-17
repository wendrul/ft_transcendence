docker stop `docker ps -qa`

docker rm `docker ps -qa`

yes | docker volume prune
