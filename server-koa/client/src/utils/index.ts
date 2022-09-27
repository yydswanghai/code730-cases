export function delay(duratioin: number = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, duratioin);
    });
}