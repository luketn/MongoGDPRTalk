function areAllChunksOnCorrectShards() {
    try {
            
        var result = db.getSisterDB("config").tags.aggregate([
            {$lookup: {from:'chunks', localField:'min.country', foreignField:'min.country', as:'chunks'}}
           ,{$unwind: '$chunks'}
           ,{$project: {
               _id:0,
               'tagRangeCountry':'$min.country', 
               'tagRangeTag':'$tag', 
               'chunkMinCountry': '$chunks.min.country',
               'chunkMaxCountry': '$chunks.max.country',
               'chunkShard': '$chunks.shard',
              }
            }
            ,{$lookup: {from:'shards', localField:'chunkShard', foreignField:'_id', as:'chunkShardDetail'}}
            ,{$unwind: '$chunkShardDetail'}
            ,{$project: {'tagRangeCountry':'$tagRangeCountry','tagRangeTag': '$tagRangeTag', 'chunkShard': '$chunkShard', 'chunkShardTag': '$chunkShardDetail.tags', 'isTagRangeChunk': {$eq:['$chunkMinCountry', '$chunkMaxCountry']}, 'chunkOnCorrectShard': {$in:['$tagRangeTag', '$chunkShardDetail.tags']}}}
            ,{$match: {isTagRangeChunk:true}}
            ,{$group: {_id:'$chunkOnCorrectShard', 'countries': {$push:'$tagRangeCountry'}}}
            ,{$project: {'chunkOnCorrectShard':'$_id', 'countries': '$countries', _id:0}}
            ,{$sort: {'chunkOnCorrectShard':-1}}
       ]).toArray()

        if (!result || result.length == 0) {
            print("Chunk query not yet returning results...")
            return false
        } else if (result.length > 1) {
            var count_correct = result[0].countries.length
            var total = count_correct + result[1].countries.length
            print(count_correct + "/" + total + " country's chunks are on the right shard...")
            return false
        } else {
            print("All " + result[0].countries.length + " chunks are on the right shard.")
            return true
        }
    } catch (e) {
        printjsononeline(e)
        return false
    }
}

while(!areAllChunksOnCorrectShards()) {
    sleep(10000)
}