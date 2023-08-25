type DebounceFunction = (func: (...args: any[]) => void, delay: number) => (...args: any[]) => void;

export const debounce: DebounceFunction = (func, delay) => {
    let timeout: NodeJS.Timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
