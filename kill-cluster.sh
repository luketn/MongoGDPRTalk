killall mongod
killall mongos
while [ `ps -ef | grep mongo | wc -l` -gt 1 ]; do
  sleep 1s
done
echo "All mongo processes are finished."

rm -rf ./cluster
echo "Files cleaned up."