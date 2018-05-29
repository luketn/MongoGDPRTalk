. ./utils.sh

cd cluster

start_mongo "shardsvr" "21003" "ru" 

run_mongo_script add_russian_shard_to_cluster.js
run_mongo_script check_chunks.js "27017" true
