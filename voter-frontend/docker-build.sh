#!/bin/bash

########################################
# relative directories
########################################
readonly name=$(basename $0)
readonly dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly parentDir="$(dirname "$dir")"

###########################################
# Cleanup
###########################################
rm -f $dir/.env

###########################################
# Mode
###########################################
mode=development
echo "The mode is: $mode"

###########################################
# Config
# - the config file with all IPs and ports
###########################################
globalConfig=$parentDir/system.json

###########################################
# ENV variables
###########################################
# - Specify NODE_ENV
NODE_ENV=$mode

###########################################
# write ENV variables into .env
###########################################
echo NODE_ENV=$NODE_ENV >> $dir/.env

####### FRONTEND

###########################################
# ENV variables
###########################################
ACCESS_PROVIDER_PORT=443
ACCESS_PROVIDER_EXTERNAL=$(cat $globalConfig | jq .services.access_provider_backend.ip.external | tr -d \")

IDENTITY_PROVIDER_PORT=443
IDENTITY_PROVIDER_EXTERNAL=$(cat $globalConfig | jq .services.identity_provider_backend.ip.external | tr -d \")

VOTER_FRONTEND_EXTERNAL=$(cat $globalConfig | jq .services.voter_frontend.ip.external | tr -d \")

ETHSTATS_PORT=443
ETHSTATS_IP_EXTERNAL=$(cat $globalConfig | jq .services.ethstats.ip.external | tr -d \")

###########################################
# write ENV variables into .env
###########################################
echo REACT_APP_ACCESS_PROVIDER_PORT=${ACCESS_PROVIDER_PORT} >> $dir/.env
echo REACT_APP_ACCESS_PROVIDER_IP=${ACCESS_PROVIDER_EXTERNAL} >> $dir/.env
echo REACT_APP_IDENTITY_PROVIDER_PORT=${IDENTITY_PROVIDER_PORT} >> $dir/.env
echo REACT_APP_IDENTITY_PROVIDER_IP=${IDENTITY_PROVIDER_EXTERNAL} >> $dir/.env
echo REACT_APP_ETHSTATS_IP=${ETHSTATS_IP_EXTERNAL} >> $dir/.env
echo REACT_APP_ETHSTATS_PORT=${ETHSTATS_PORT} >> $dir/.env

echo VOTER_FRONTEND_EXTERNAL=${VOTER_FRONTEND_EXTERNAL} >> $dir/.env

cd $dir

# start docker containers
DOCKER_BUILDKIT=1 docker build -t voter_frontend . --build-arg AP_PORT=$REACT_APP_ACCESS_PROVIDER_PORT --build-arg AP_IP=$REACT_APP_ACCESS_PROVIDER_IP --build-arg IP_PORT=$REACT_APP_IDENTITY_PROVIDER_PORT --build-arg IP_IP=$REACT_APP_IDENTITY_PROVIDER_IP
docker-compose -f pre_built.yml up --detach --no-build

# remove all temp files
rm -f $dir/.env
