#!/bin/bash

args=("$@")
if (test ${args[0]} = "build") then
  docker-compose -f docker-compose.backend.only.yml up --build
else
  docker-compose -f docker-compose.backend.only.yml up 
fi
