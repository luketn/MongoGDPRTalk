sh.addShard('ru/localhost:21003')

sh.addShardTag('ru', 'Russia')

printjsononeline(sh.removeTagRange('AwesomeProduct.people', {country:'RU', name:MinKey}, {country:'RU', name:MaxKey}, 'Europe'))
printjsononeline(sh.addTagRange('AwesomeProduct.people', {country:'RU', name:MinKey}, {country:'RU', name:MaxKey}, 'Russia'))

// optional: speed up the chunk move and eventual cleanup of the data (the balancer will do the below on a slower timeframe)
db.getSisterDB('admin').runCommand( { moveChunk : 'AwesomeProduct.people',
                 bounds : [{country:'RU', name:MinKey}, {country:'RU', name:MaxKey}],
                 to : 'ru',
                 _secondaryThrottle : false,
                 _waitForDelete : true 
                 })
// \

print('Created tag range for Russia for AwesomeProduct.people')
