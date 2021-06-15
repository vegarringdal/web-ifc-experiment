export function isValidHttpUrl(string: string) {
    if (typeof string !== "string") {
        return false;
    }

    if (string.includes("https://") || string.includes("http://")) {
        return true;
    } else {
        return false;
    }
}
