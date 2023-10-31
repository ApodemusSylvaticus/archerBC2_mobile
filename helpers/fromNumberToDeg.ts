export function degreesFromNumber(val: number) {
    return ((val % 360) + 360) % 360;
}
