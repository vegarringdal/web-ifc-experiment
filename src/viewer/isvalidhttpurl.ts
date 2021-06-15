export function isValidHttpUrl(string: string) {
    if (string.includes("https://") || string.includes("http://")) {
        return true;
    } else {
        return false;
    }
}
