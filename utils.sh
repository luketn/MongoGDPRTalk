
function wait_for_line {
  FILE_TO_WATCH=$1
  TEXT_TO_WAIT_FOR=$2
  DEBUG=${3:-false}

  tail -f $FILE_TO_WATCH | while read LINE
  do
    if $DEBUG; then
      echo $LINE
    fi
    [[ "${LINE}" == *$TEXT_TO_WAIT_FOR* ]] && pkill -P $$ tail
  done
  if $DEBUG; then
    echo `date`" Found '"$TEXT_TO_WAIT_FOR"' in "$FILE_TO_WATCH"."
  fi
}

function start_mongo {
  SERVER_TYPE=$1
  PORT=$2
  REPLICA_SET_NAME=$3
  DATA_DIRECTORY=$REPLICA_SET_NAME"-data"
  LOG_FILE=$REPLICA_SET_NAME"-mongod.log"
  
  mkdir $DATA_DIRECTORY
  touch $LOG_FILE
  mongod "--"$SERVER_TYPE --dbpath $DATA_DIRECTORY --port $PORT --replSet $REPLICA_SET_NAME > $LOG_FILE &
  mongo localhost:$PORT --eval "rs.initiate()" > $LOG_FILE &
  wait_for_line $LOG_FILE "transition to primary complete"
  echo `date`" Successfully started "$REPLICA_SET_NAME" "$SERVER_TYPE" mongod on port "$PORT"!"
}

function start_mongos {
  CONFIG_CONNECTION=$1
  PORT=${2:-27017}
  LOG_FILE="mongos-"$PORT".log"

  touch $LOG_FILE
  mongos -vv --port $PORT --configdb $CONFIG_CONNECTION > $LOG_FILE &
  wait_for_line $LOG_FILE "waiting for connections on port "$PORT
  echo `date`" Successfully started "$CONFIG_CONNECTION" mongos on port "$PORT"!"
}

function run_mongo_script {
  SCRIPT_FILE_NAME=$1
  PORT=${2:-27017}
  DEBUG=${3:-false}
  LOG_FILE="mongo-"$SCRIPT_FILE_NAME".log"

  touch $LOG_FILE
  mongo < ../$SCRIPT_FILE_NAME > $LOG_FILE &
  wait_for_line $LOG_FILE "bye" $DEBUG
  echo `date`" Script "$SCRIPT_FILE_NAME" run!"
}