const ExcelJS = require('exceljs');
const fs = require('fs');

const xlsFilePath = 'dataBullet.xlsx';

const workbook = new ExcelJS.Workbook();

workbook.xlsx
    .readFile(xlsFilePath)
    .then(() => {
        const worksheet = workbook.getWorksheet(1); // 1 - это номер листа (нумерация с 1)

        const jsonData = [];
        let headers = [];

        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) {
                headers = row.values;
                return;
            }

            const rowData = {};

            row.eachCell((cell, colIndex) => {
                const header = headers[colIndex];
                const value = cell.value;

                rowData[header] = value;
            });

            jsonData.push(rowData);
        });

        fs.writeFileSync('dataBullet.json', JSON.stringify(jsonData, null, 2));
        console.log('Данные сохранены в dataBullet.json');
    })
    .catch(error => {
        console.error('Ошибка при чтении файла XLS:', error);
    });
