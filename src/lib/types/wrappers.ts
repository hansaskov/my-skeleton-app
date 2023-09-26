

export type Prettify<T> = {
    [K in keyof T]: T[K];
    } & {};


export type PartialWithAtLeastOneField<T> = Partial<T> & {
    [K in keyof T]: T[K];
  };
  