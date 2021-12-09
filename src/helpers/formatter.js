export default class Formatter {
    constructor() {}

    krakenToGoogleChart(data) {
        const formatted = {
            "cols": [
                {"id":"","label":"Time","pattern":"","type":"date"},
                {"id":"","label":"Bitcoin","pattern":"","type":"number"}
              ],
            "rows": []
        };

        const result = data.result.XXBTZUSD;

        formatted.rows = result.map((row) => {
            const timestamp = new Date(parseInt(row[2].toString().replace('.', '').slice(0,13))).toISOString();

            const year = timestamp.slice(0, 4);
            const month = parseInt(timestamp.slice(5, 7)) - 1;
            const date = timestamp.slice(8, 10);
            const hour = timestamp.slice(11, 13);
            const timestampString = 'Date(' + year + ',' + month + ',' + date + ',' + hour + ')';

            return {"c":[{"v": timestampString,"f":null},{"v":row[0],"f":null}]};
        });

        // formatted.rows.push();

        return formatted;
    }
}