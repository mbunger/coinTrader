import fs from 'fs';

export default class Kraken {
    data;
    constructor(crypto) {
        const cryptos = crypto;
        const rawdata = fs.readFileSync('./src/data/krakenbtcdata.json');
        this.data = JSON.parse(rawdata);
    }

    async getCurrentPrice(symbol) {
        return new Promise( resolve => {
            resolve(this.data);
        });
    }

    getPrice(symbol, time) {
        // Kraken uses unix epoch for instance: 1636981258.9982
        const url = 'https://api.kraken.com/0/public/Trades?pair=' + symbol + '&since=' + time;
        return this.data.result.XXBTZUSD[0][0];
        // return new Promise( resolve => {
        //     resolve(this.data.result.XXBTZUSD[0][0]);
        // });
    }
}