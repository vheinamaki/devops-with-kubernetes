#!/bin/bash
docker build "$1" -t vhmk/"$2" && docker push vhmk/"$2"
