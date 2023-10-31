export type Nullable<T> = null | T;

export type WithFileName<T> = T & {
    fileName: string;
};
