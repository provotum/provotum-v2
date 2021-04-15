#!/bin/bash

./voting-authority/prod.sh
./access-provider-backend/docker-start.sh
./identity-provider-backend/docker-start.sh
./voter-frontend/docker-build.sh
# start and register 3 nodes
./poa-blockchain/scripts/prod-chain-sealers.sh
./ethstats/docker-start.sh

curl -X POST \
  http://localhost:4003/registerVoters \
  -H 'Content-Type: application/json' \
  -d '{
    "voters": [
        "9980280d-32d1-41e9-8959-7c483e43256b",
        "afd948fe-7b48-421b-accb-389619f8456c",
        "5342b7e8-3f8e-4520-ac4e-e0b54f1d1ead"
    ]
}'

docker ps
