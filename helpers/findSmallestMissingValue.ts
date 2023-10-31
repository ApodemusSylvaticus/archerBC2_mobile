import { FILE_NAMES } from '@/interface/reticles';

export function findSmallestMissingValue(selectedList: FILE_NAMES[]): FILE_NAMES {
    let smallestMissingValue = 0;

    selectedList.sort((a, b) => a - b);

    let foundValue = selectedList.find(value => value === smallestMissingValue);

    while (foundValue !== undefined) {
        smallestMissingValue += 1;
        // eslint-disable-next-line no-loop-func
        foundValue = selectedList.find(value => value === smallestMissingValue);
    }

    return smallestMissingValue;
}
