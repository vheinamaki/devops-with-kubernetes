#!/bin/bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 \
&& docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube \
&& kubectl create namespace logging-namespace \
&& kubectl create namespace todoproject-namespace
