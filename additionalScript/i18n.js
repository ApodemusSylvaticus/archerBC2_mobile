const http = require('http');

const spreadsheetUrl = 'http://spreadsheets.google.com/feeds/cells/1vM9-diOOU6Cclqn4lUMRLh-XAle5_vg0xh0Lhty9VnM/1/public/full?alt=json';

function fetchDataAndCreateObject() {
    const req = http.get(spreadsheetUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const jsonData = JSON.parse(data);
            const entries = jsonData.feed.entry;
            const obj = {};

            const headerRow = entries.filter(entry => entry.gs$cell.row === '1').map(entry => entry.gs$cell.$t);
            const languageColumns = headerRow.slice(2);

            for (let i = 1; i < entries.length; i++) {
                const entry = entries[i];
                const cell = entry.gs$cell;
                const row = parseInt(cell.row);
                const col = parseInt(cell.col);

                if (col === 1) {
                    continue; // Пропустить первый столбец
                }

                const section = entries.find(e => e.gs$cell.row === row && e.gs$cell.col === '1').gs$cell.$t;
                const key = entries.find(e => e.gs$cell.row === row && e.gs$cell.col === '2').gs$cell.$t;
                const language = headerRow[col - 1];
                const value = cell.$t;

                const languageObj = obj[language] || {};
                const languageKey = `${section}_${key}`;
                languageObj[languageKey] = value;
                obj[language] = languageObj;
            }

        });
    });

    req.on('error', (error) => {
        console.error('Error:', error);
    });

    req.end();
}

fetchDataAndCreateObject();
