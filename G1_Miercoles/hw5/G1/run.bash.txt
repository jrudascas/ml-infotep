#!/bin/bash

# Run below step one by one in terminal

docker build -t kmeans .

docker run -it -p 8888:8888 -v /home/beastan/Documents/blogs_code/kmeans:/home/jovyan/work kmeans

