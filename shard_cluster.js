sh.addShard('eu/localhost:21000')
sh.addShard('us/localhost:21001')
sh.addShard('ap/localhost:21002')

var shardTagToShard = {
    "Europe" : 'eu',  
    "Africa" : 'eu',  
    "Americas" : 'us',  
    "Asia" : 'ap',  
    "Oceania" : 'ap' 
}
Object.keys(shardTagToShard).forEach(tag => {
    sh.addShardTag(shardTagToShard[tag], tag)
})

sh.enableSharding('AwesomeProduct')
db.getSiblingDB('AwesomeProduct').getCollection('people').createIndex({'country':1,'name':1})
sh.shardCollection('AwesomeProduct.people',{'country':1,'name':1})

var shardTagToCountryCode = {  
    "Europe" : [ "AL", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "MK", "MD", "NL", "NO", "PL", "PT", "RO", "RU", "SK", "SI", "ES", "SE", "CH", "UA", "GB" ],  
    "Africa" : [ "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CF", "TD", "CG", "CD", "CI", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "SN", "SL", "SO", "ZA", "SS", "SD", "SZ", "TZ", "TG", "TN", "UG", "ZM", "ZW" ],  
    "Americas" : [ "AR", "BO", "BR", "CA", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "PY", "PE", "PR", "TT", "US", "UY", "VE" ],  
    "Asia" : [ "AF", "AM", "AZ", "BH", "BD", "KH", "CN", "GE", "HK", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MN", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE" ],  
    "Oceania" : [ "AU", "NZ", "PG" ] 
}

var countTagRanges = 0
Object.keys(shardTagToCountryCode).forEach(shard => {
    shardTagToCountryCode[shard].forEach(countryCode => {
        printjsononeline(sh.addTagRange('AwesomeProduct.people', {country:countryCode, name:MinKey}, {country:countryCode, name:MaxKey}, shard))
        countTagRanges++
    })
})
print('Created tag ranges for ' + countTagRanges + ' country codes across three shard tags for AwesomeProduct.people')
