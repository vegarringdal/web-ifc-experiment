let colorI = 0;

export function getNewColorId() {
    colorI++;
    return colorI;
}

export function getCurrentColorId() {
    return colorI;
}

export function resetColorId() {
    colorI = 0;
}
