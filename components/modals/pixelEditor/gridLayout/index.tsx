import React from 'react';
import { Cell, Container } from '@/components/modals/pixelEditor/gridLayout/style';

interface GridLayoutProps {
    width: number;
    height: number;
    totalWidth: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ height, width, totalWidth }) => {
    const matrix: string[][] = new Array(height).fill(new Array(width).fill(''));
    const size = totalWidth / width;

    return (
        <Container pointerEvents="none">
            {matrix.map((el, y) =>
                el.map((_, x) => (
                    <Cell
                        totalWidth={totalWidth}
                        style={{
                            borderRightWidth: x !== width - 1 ? 1 : 0,
                            borderBottomWidth: y !== height - 1 ? 1 : 0,
                            width: size,
                            height: size,
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
