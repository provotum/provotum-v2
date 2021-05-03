#!/bin/bash

########################################
# relative directories
########################################
readonly name=$(basename $0)
readonly dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly parentDir="$(dirname "$dir")"

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

ETHSTATS_PORT=$(cat $globalConfig | jq .services.ethstats.port)
ETHSTATS_IP=$(cat $globalConfig | jq .services.ethstats.ip.external | tr -d \")
# - POA Blockchain Main RPC PORT (the port stays the same, in dev and prod mode)
PARITY_NODE_IP=$(cat $globalConfig | jq .services.sealer_parity_1.ip.external | tr -d \")
PARITY_NODE_PORT=443

###########################################
# write ENV variables into .env
###########################################
echo ETHSTATS_PORT=$ETHSTATS_PORT >> $dir/.env
echo ETHSTATS_IP=$ETHSTATS_IP >> $dir/.env
echo PARITY_NODE_PORT=$PARITY_NODE_PORT >> $dir/.env
echo PARITY_NODE_IP=$PARITY_NODE_IP >> $dir/.env

# ###########################################
# # start container
# ###########################################
cd $dir

# build containers
docker-compose -p eth-stats -f docker-compose.yml up --build --detach

rm -f $dir/.env
