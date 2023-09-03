const { google } = require('googleapis');
const fs = require('fs');

// Замените на свои данные
const spreadsheetId = '1vM9-diOOU6Cclqn4lUMRLh-XAle5_vg0xh0Lhty9VnM';
const range = 'Sheet1'; // Здесь указываете нужный диапазон


const auth = new google.auth.GoogleAuth({
    keyFilename: 'neon-well-309913-147f2c3e64b8.json', // Путь к вашему файлу с ключами
    scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
});


// Создаем клиента для доступа к Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Получаем данные из таблицы
sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
}, (err, res) => {
    if (err) return console.error('Ошибка:', err);

    if (res.data.values) {
        const output = {}
        let isLanguageSection = false
        let isTranslationSection = false

        const languageSimbolArray = []

        res.data.values.forEach(el => {
            if (el.length === 0){
                return;
            }
            if (el[0] === 'Language' && el[1] === 'Language simbol'){
                isLanguageSection = true
                return
            }

            if (el[0] === 'section' && el[1] === 'key'){
                isTranslationSection = true
                isLanguageSection = false
                return
            }


            if(isLanguageSection) {
                output[el[1]] = {
                    name: el[0],
                    symbol: el[1],
                    isLTR: el[2] === 'TRUE',
                    data: {}
                }
                languageSimbolArray.push(el[1])
                return;
            }

            if(isTranslationSection){
                languageSimbolArray.forEach((item, index) => {
                    output[item].data[`${el[0]}_${el[1]}`] = el[2 + index]
                })
            }
        })

        output.languageSimbolArray = languageSimbolArray;
        const jsonData = JSON.stringify(output, null, 2);

        fs.writeFileSync('data.json', jsonData, 'utf-8');

    }
});
