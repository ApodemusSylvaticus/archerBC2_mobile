import React, { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { GridLayout } from '@/components/pixelEditor/gridLayout';
import { PixelEditor } from '@/helpers/pixelEditor';
import { getWindowHeight } from '@/helpers/getWindowParam';

/* export const PixelEditor: React.FC = () => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            console.log(ref);
            const ctx = ref.current.getContext('2d');

            ctx.beginPath();
            ctx.arc(100, 100, 40, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    }, [ref]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Canvas ref={ref} style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />
        </SafeAreaView>
    );
}; */

export const WebPixelEditor: React.FC = () => {
    const [isScrollable, setIsScrollable] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isGridVisible, setIsGridVisible] = useState(false);
    const pixelEditor = useRef<PixelEditor>();

    const ref = useRef<HTMLCanvasElement>(null);

    const onViewLayout = useCallback((e: { nativeEvent: { layout: { height: any; width: any } } }) => {
        if (ref.current) {
            const { height, width } = e.nativeEvent.layout;

            pixelEditor.current = new PixelEditor(ref.current, height, width);
            pixelEditor.current?.setColumnCount(50);
            setIsGridVisible(true);
        }
    }, []);

    const onCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (event.button === 1) {
            event.preventDefault();
            setIsScrollable(true);
            setPosition({ x: event.clientX, y: event.clientY }); // Записываем начальные координаты
            return;
        }
        pixelEditor.current?.paint(event.clientX, event.clientY);
    }, []);

    const onCanvasMouseMove = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (isScrollable) {
                // TODO try to create effect like figma
                const xOffset = event.clientX - position.x;
                const yOffset = event.clientY - position.y;

                // eslint-disable-next-line no-unused-expressions
                xOffset !== 0 && pixelEditor.current?.updateOxShift(xOffset);
                // eslint-disable-next-line no-unused-expressions
                yOffset !== 0 && pixelEditor.current?.updateOyShift(yOffset);

                // TODO debounce
                pixelEditor.current?.redrawCanvas();
                setPosition({ x: event.clientX, y: event.clientY });
            }
        },
        [isScrollable, position],
    );
    const onCanvasMouseUp = useCallback(() => {
        setIsScrollable(false);
        setPosition({ x: 0, y: 0 });
    }, []);

    // TODO fix this crunch
    /*
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const fileReader = new FileReader();

            fileReader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    const ctx = pixelEditor.current!.canvas!.getContext('2d');
                    const pixels = [];

                    ctx!.drawImage(img, 0, 0);
                    const imageData = ctx!.getImageData(0, 0, img.width, img.height);
                    for (let y = 0; y < img.height; y++) {
                        for (let x = 0; x < img.width; x++) {
                            const index = (y * img.width + x) * 4;
                            const r = imageData.data[index];
                            const g = imageData.data[index + 1];
                            const b = imageData.data[index + 2];
                            pixels.push({
                                x,
                                y,
                                r,
                                g,
                                b,
                            });
                        }
                    }

                    pixelEditor.current?.setPixelData(pixels);
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                img.src = e.target.result;
            };
            fileReader.readAsDataURL(file);
        }
    };
*/

    return (
        <ScrollView
            style={{
                backgroundColor: 'red',
                padding: 10,
            }}>
            <ScrollView
                style={{
                    flexGrow: 1,
                    minHeight: getWindowHeight(),
                    position: 'relative',
                    backgroundColor: 'white',
                }}
                onLayout={onViewLayout}>
                {isGridVisible && (
                    <GridLayout height={pixelEditor.current!.rowCount} width={pixelEditor.current!.columnCount} />
                )}

                <canvas
                    onMouseDown={onCanvasMouseDown}
                    onMouseMove={onCanvasMouseMove}
                    onMouseUp={onCanvasMouseUp}
                    ref={ref}
                    style={{ flexGrow: 1 }}
                />
            </ScrollView>
        </ScrollView>
    );
};
