export interface IPixel {
    x: number;
    y: number;
    color?: { r: number; g: number; b: number };
}

export interface IHistoryElem {
    index: number;
    prev: { r: number; g: number; b: number };
    actual: { r: number; g: number; b: number };
}
