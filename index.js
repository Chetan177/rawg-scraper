const axios = require('axios');
const fs = require('fs');


const dataDir = "data/page-"
// 'https://api.rawg.io/api/games?page=1?page_size=40'


const startPage = 1;
const endPage = 2;

const main = async function () {
    for (i = startPage; i <= endPage; i++) {
        console.log(`page no ${i}` + dataDir + `${i}.json`);
        const URL = `https://api.rawg.io/api/games?page=${i}&page_size=40`

        await axios.get(URL).then(function (response) {
            const data = JSON.stringify(response.data, null, 2);
            fs.writeFileSync(dataDir + `${i}.json`, data, (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        }).catch(function (error) {
            console.log(error);
        })

    }
}

main();


