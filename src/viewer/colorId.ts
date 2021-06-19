let colorI = 0;

export function getId() {
    colorI++;
    return colorI;
}

export function getCurrentID() {
    return colorI;
}

export function resetId() {
    colorI = 0;
}
