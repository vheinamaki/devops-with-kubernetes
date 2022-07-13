#!/bin/bash
SOPS_AGE_KEY_FILE=$(dirname -- "$0")/key.txt sops --decrypt pg.secret.enc.yaml > .temp/pg.secret.yaml &&\
SOPS_AGE_KEY_FILE=$(dirname -- "$0")/key.txt sops --decrypt broadcast.secret.enc.yaml > .temp/broadcast.secret.yaml &&\
kustomize edit add resource .temp/pg.secret.yaml &&\
kustomize edit add resource .temp/broadcast.secret.yaml &&\
kustomize build . | kubectl apply -f -
# cleanup
kustomize edit remove resource .temp/pg.secret.yaml
kustomize edit remove resource .temp/broadcast.secret.yaml
rm .temp/pg.secret.yaml .temp/broadcast.secret.yaml
