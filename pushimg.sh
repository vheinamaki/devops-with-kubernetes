#!/bin/bash
docker build . -f "$1" -t vhmk/"$2" && docker push vhmk/"$2"
