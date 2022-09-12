#!/bin/bash

args=("$@")
if (test ${args[0]} = "build") then
  docker-compose -f docker-compose.frontend.only.yml up --build
else
  docker-compose -f docker-compose.frontend.only.yml up 
fi
