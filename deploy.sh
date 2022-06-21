#!/bin/bash
SOPS_AGE_KEY_FILE=$(dirname -- "$0")/key.txt sops --decrypt pg.secret.enc.yaml | kubectl apply -f manifests/ -f -
