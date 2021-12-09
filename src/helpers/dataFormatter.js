'use strict';

import fs from 'fs';

let rawdata = fs.readFileSync('bitcoin.json');
let rawdata2 = fs.readFileSync('doge.json');
let data = JSON.parse(rawdata);
let data2 = JSON.parse(rawdata2);

const formatted = {
    "cols": [
        {"id":"","label":"Time","pattern":"","type":"date"},
        {"id":"","label":"Bitcoin","pattern":"","type":"number"},
        {"id":"","label":"Doge","pattern":"","type":"number"}
      ],
    "rows": []
};

data.data.forEach((element, index) => {
    const year = element.end.slice(0, 4);
    const month = parseInt(element.end.slice(5, 7)) - 1;
    const date = element.end.slice(8, 10);
    const hour = element.end.slice(11, 13);
    const timestampString = 'Date(' + year + ',' + month + ',' + date + ',' + hour + ')';
    formatted.rows.push({"c":[{"v": timestampString,"f":null},{"v":element.tweet_count,"f":null},{"v":data2.data[index].tweet_count,"f":null}]});
});

let output = JSON.stringify(formatted, null, 2);
fs.writeFileSync('test.json', output);