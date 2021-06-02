let colorI = 0;

export function getNewColorId() {
    colorI++;
    return colorI;
}

export function getCurrentColorId() {
    return colorI;
}
