import fs from 'fs';

export default class Twitter {
    data = new Map();
    constructor(crypto) {
        const cryptos = ['cardano', 'bitcoin', 'doge', 'ethereum'];
        const cardano = fs.readFileSync('./src/data/twittercardano.json');
        const bitcoin = fs.readFileSync('./src/data/twitterbitcoin.json');
        const doge = fs.readFileSync('./src/data/twitterdoge.json');
        const ethereum = fs.readFileSync('./src/data/twitterethereum.json'); 

        this.data.set('cardano', JSON.parse(cardano));
        this.data.set('bitcoin', JSON.parse(bitcoin));
        this.data.set('doge', JSON.parse(doge));
        this.data.set('ethereum', JSON.parse(ethereum));
    }

    getTrends(term) {
        const url = 'https://api.twitter.com/2/tweets/counts/recent?query=' + term;
        return new Promise( resolve => {
            resolve(this.data.get(term));
        });
    }

    getTreeMapData() {
        const results = new Map();
        this.data.forEach((element, key) => {
            const total = element.meta.total_tweet_count;
            const latest = element.data[element.data.length -2].tweet_count;
            const ratio = latest / total;

            results.set(key, ratio.toString());
        });

        return JSON.stringify(Object.fromEntries(results));
    }
}