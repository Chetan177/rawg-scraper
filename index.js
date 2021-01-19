const axios = require('axios');
const { MongoClient } = require('mongodb');

// const DB_URI = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority"
const DB_URI = "mongodb://localhost:27017/"
const DB_Name = "gamesdb"

const dataDir = "data/page-"
// 'https://api.rawg.io/api/games?page=12345?page_size=40'


const startPage = 1;

const dbClient = new MongoClient(DB_URI);

const main = async function () {
    await dbClient.connect();
    databasesList = await dbClient.db().admin().listDatabases();

    for (i = startPage; ; i++) {

        const URL = `https://api.rawg.io/api/games?page=${i}&page_size=40`

        await axios.get(URL).then(function (response) {

            let data = response.data.results
            data.forEach(function (element, index) {
                element._id = element.id
                // insert one by one
                insertIntoDB(dbClient, element)
            });

            console.log(`collected data of page ${i}`)

            // insertIntoDB(dbClient, data)

        }).catch(function (error) {
            console.log(error);
        })

    }

}

const insertIntoDB = async function (client, data) {
    var dbObj = client.db(DB_Name)
    dbObj.collection("games").insertOne(data, function (err, res) {
        if (err) {
            if (err && err.code === 11000) { console.error(`got duplicate key ${data._id}`) }
            return
        }
        console.log(` id: ${data._id} doc added`);
    });

}

main();


