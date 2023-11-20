import React, { useEffect, useState } from 'react';
import { Image as IMG } from 'react-native';

/* function pixelArrayToBase64(pixelArray) {
    let binaryData = '';
    for (const row of pixelArray) {
        for (const pixel of row) {
            const red = pixel.r != null ? pixel.r : 0;
            const green = pixel.g != null ? pixel.g : 0;
            const blue = pixel.b != null ? pixel.b : 0;
            const alpha = pixel.a != null ? pixel.a : 0;

            binaryData += String.fromCharCode(red, green, blue);

            if ('a' in pixel) {
                // Проверяем наличие альфа-канала и добавляем его, если присутствует
                binaryData += String.fromCharCode(alpha);
            }
        }
    }

    const base64String = btoa(binaryData);
    return base64String;
}
function changePixelColor(pixelArray, newColor) {
    const modifiedArray = [];

    for (const row of pixelArray) {
        const modifiedRow = [];
        for (const pixel of row) {
            modifiedRow.push({
                r: Number.isNaN(pixel.r) ? NaN : newColor.r,
                g: Number.isNaN(pixel.g) ? NaN : newColor.g,
                b: Number.isNaN(pixel.b) ? NaN : newColor.b,
                a: pixel.a, // если в пикселе есть альфа-канал, вы можете передать его без изменений
            });
        }
        modifiedArray.push(modifiedRow);
    }

    return modifiedArray;
}

function base64ToPixelArray(base64String, width, height) {
    const pixelArray = [];

    const binaryData = atob(base64String);

    // Создаем Uint8Array для обработки бинарных данных
    const uint8Array = new Uint8Array(binaryData.length);

    // Заполняем Uint8Array данными из binaryData
    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    let dataIndex = 0;

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const pixel = {
                r: uint8Array[dataIndex],
                g: uint8Array[dataIndex + 1],
                b: uint8Array[dataIndex + 2],
                a: uint8Array[dataIndex + 3], // Альфа-канал
            };
            row.push(pixel);
            dataIndex += 4; // Увеличиваем индекс на 4, так как у нас 4 компонента цвета (r, g, b, a)
        }
        pixelArray.push(row);
    }

    return pixelArray;
} */

export const Convector: React.FC = () => {
    const [realBase64] = useState('');
    useEffect(() => {
        /* async function getImg() {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                base64: true,
                quality: 1,
                aspect: [4, 3],
            });
            if (result.canceled) {
                return;
            }

            const { width, height, base64 } = result.assets[0];
            console.log('Original base64:', base64);

            const newPixelArray = base64ToPixelArray(
                'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAD9JREFUSEvt07ENADAIA0Gz/9BJn96kOQYA6fTMSU4+zDi8pY56SzqoUdcExFWjfRejRl0TEFeN1h+LS1w1gQtIpTvjEDU+xAAAAABJRU5ErkJggg==',
                width,
                height,
            );

            const newColor = { r: 255, g: 0, b: 0 };

            const clone = changePixelColor(newPixelArray, newColor);

            const newBase64 = pixelArrayToBase64(newPixelArray);

            setRealBase64(newBase64);
        } */

        function helper() {
            const base64String =
                'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAD9JREFUSEvt07ENADAIA0Gz/9BJn96kOQYA6fTMSU4+zDi8pY56SzqoUdcExFWjfRejRl0TEFeN1h+LS1w1gQtIpTvjEDU+xAAAAABJRU5ErkJggg==';

            // Создаем элемент изображения
            const img = new Image();

            // Устанавливаем источник изображения как base64 строку
            img.src = `data:image/png;base64,${base64String}`;

            // Ждем, пока изображение полностью загрузится
            img.onload = function () {
                // Создаем холст
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Устанавливаем размеры холста равными размерам изображения
                canvas.width = img.width;
                canvas.height = img.height;

                // Рисуем изображение на холсте
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ctx.drawImage(img, 0, 0);

                // Получаем данные изображения в виде массива RGBA
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                // Теперь imageData содержит данные о каждом пикселе в виде массива [R, G, B, A, R, G, B, A, ...]

                // Создаем матрицу пикселей, например, 2D-массив
                const pixelMatrix = [];

                for (let i = 0; i < imageData.length; i += 4) {
                    const pixel = [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
                    pixelMatrix.push(pixel);
                }

                // Теперь у вас есть матрица пикселей, где каждый пиксель представлен массивом [R, G, B, A]

                // Пример вывода матрицы в консоль
                console.log(pixelMatrix);
            };
        }

        helper();
    }, []);

    return (
        <IMG
            style={{
                borderWidth: 5,
                borderColor: 'rgb(227,6,160)',
                resizeMode: 'cover',
                width: 320,
                height: 240,
            }}
            source={{
                uri: `data:image/jpeg;base64,${realBase64}`,
            }}
        />
    );
};
