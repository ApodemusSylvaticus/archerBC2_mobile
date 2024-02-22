export type Nullable<T> = null | T;

export type WithFileName<T> = T & {
    fileName: string;
};

export function assertNever(x: never): never {
    throw new Error(`Unexpected object: ${x}`);
}
