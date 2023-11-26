import React from 'react';
import { Cell, Container } from '@/components/pixelEditor/gridLayout/style';

interface GridLayoutProps {
    width: number;
    height: number;
    totalWidth: number;
}
export const GridLayout: React.FC<GridLayoutProps> = ({ height, width, totalWidth }) => {
    const matrix: string[][] = new Array(height).fill(new Array(width).fill(''));

    return (
        <Container pointerEvents="none">
            {matrix.map((el, y) =>
                el.map((_, x) => (
                    <Cell
                        totalWidth={totalWidth}
                        style={{
                            borderRightWidth: x !== width - 1 ? 0.5 : 0,
                            borderBottomWidth: y !== height - 1 ? 0.5 : 0,
                        }}
                        size={width}
                        key={y.toString() + x.toString()}
                    />
                )),
            )}
        </Container>
    );
};

export const MemoGridLayout = React.memo(GridLayout);
