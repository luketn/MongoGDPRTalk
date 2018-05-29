var people = [
    {"name": "Luke", "country": "GB"},
    {"name": "Angela", "country": "DE"},
    {"name": "Ed", "country": "RU"},
    {"name": "Stennie", "country": "CA"},
    {"name": "Sam", "country": "AU"}
]
people.forEach((person)=>db.getSiblingDB("AwesomeProduct").people.insert(person))
