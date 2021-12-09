import fetch from 'node-fetch';
import express from 'express';
import fs from 'fs';
import Kraken from './data/kraken.js';
import Twitter from './data/twitter.js';
import Formatter from './helpers/formatter.js';

const cryptos = ['btc', 'doge', 'ethereum', 'Binance', 'Cardano'];
const app = express();
const twitter = new Twitter(cryptos);
const kraken = new Kraken(cryptos);
const formatter = new Formatter();
const port = 1337;

const token = "AAAAAAAAAAAAAAAAAAAAAGvEVQEAAAAA%2BgK1LBVJsCwI8JV0I2ypEZzpm8E%3DSbLlbltED2kUigoRskYIGWDm3uUc1CFEEbS1vo1meiKcLiDgUx";
const url = 'https://api.twitter.com/2/tweets/counts/recent?query=ronaldo&granularity=day';

// Get latest 7 days of tweet counts per hour
// curl https://api.twitter.com/2/tweets/counts/recent?query=doge -H "Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAGvEVQEAAAAA%2BgK1LBVJsCwI8JV0I2ypEZzpm8E%3DSbLlbltED2kUigoRskYIGWDm3uUc1CFEEbS1vo1meiKcLiDgUx" -o doge.json

const options = {
    method: 'GET',
    mode: 'cors',
    // headers: {
    //     Authorization: `Bearer ${token}`
    // }
};

app.use(express.static('public'));

app.get('/', (req, res) => {
    fetch('http://httpbin.org/get', options).then((res) => {
        console.log(res);
        res.send('Hello World!');
    });
})

app.get('/bitcoin', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    twitter.getTrends('bitcoin').then( async(trends) => {
        const formatted = {
            "cols": [
                {"id":"","label":"Time","pattern":"","type":"date"},
                {"id":"","label":"Price","pattern":"","type":"number"},
                {"id":"","label":"Tweets","pattern":"","type":"number"}
              ],
            "rows": []
        };

        // Get kraken data based on twitter timestamps
        const twitterdata = trends.data;
        const result = await twitterdata.forEach( async tweet => {
            const twitterTime = tweet.end;
            const twitterCount = tweet.tweet_count;
            let krakenTime = new Date(twitterTime.toString()).getTime().toString();
            krakenTime = krakenTime.slice(0,10) + '.' + krakenTime.slice(10);

            const year = twitterTime.slice(0, 4);
            const month = parseInt(twitterTime.slice(5, 7)) - 1;
            const date = twitterTime.slice(8, 10);
            const hour = twitterTime.slice(11, 13);
            const timestampString = 'Date(' + year + ',' + month + ',' + date + ',' + hour + ')';

            formatted.rows.push({"c":[{"v": timestampString,"f":null},{"v":kraken.getPrice('XXBTZUSD', krakenTime),"f":null}, {"v": twitterCount,"f":null}]});

            // Get kraken result
            // const krakenresult = await kraken.getPrice('XXBTZUSD', krakenTime).then( async (result) => {
            //     console.log({"c":[{"v": timestampString,"f":null},{"v":result,"f":null}, {"v": twitterCount,"f":null}]});
            //     formatted.rows.push({"c":[{"v": timestampString,"f":null},{"v":result,"f":null}, {"v": twitterCount,"f":null}]});
            // });
        });

        console.log(formatted);
        res.end(JSON.stringify(formatted));
    });

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

// const response = await fetch('https://github.com/');
// const body = await response.text();
// console.log(body);

// fetch('http://httpbin.org/get', options).then((res) => {
//     console.log(res);
// });

// 
// https.get('http://httpbin.org/get', options, (res) => {
//     console.log('statusCode:', res.statusCode);
//     console.log('headers:', res.headers);

//     res.on('data', (d) => {
//         console.log(d);
//         process.stdout.write(d);
//     });

//     res.on('end', function () {
//         console.log('result');
//     });

// }).on('error', (e) => {
//     console.error(e);
// });