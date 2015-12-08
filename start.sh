#!/bin/bash
sleep 10
if env | grep -q ^RANCHER_CLUSTER=; then
  MONGO_CONT=`python rancher.py`
  echo $MONGO_CONT
  export MONGO_URI=mongodb://$MONGO_CONT/graphql
  echo $MONGO_URI
fi

node --harmony index.js
