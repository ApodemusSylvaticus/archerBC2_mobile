export type Nullable<T> = null | T;

export type WithId<T> = T & {
    id: string;
};
