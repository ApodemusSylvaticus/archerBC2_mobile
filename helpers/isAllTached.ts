export const isAllTouched = (values: any) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
        if (values[key] === '') {
            return false;
        }
    }
    return true;
};
