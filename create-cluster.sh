. ./utils.sh

mkdir cluster
cd cluster

start_mongo "shardsvr" "21000" "eu" 
start_mongo "shardsvr" "21001" "us" 
start_mongo "shardsvr" "21002" "ap" 
start_mongo "configsvr" "21010" "cfg" 

start_mongos "cfg/localhost:21010" "27017"

run_mongo_script shard_cluster.js
run_mongo_script check_chunks.js "27017" true
run_mongo_script import_people.js