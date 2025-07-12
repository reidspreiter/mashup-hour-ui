export type SetterMethods<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export interface IndexDependentSettings {
  saveAndLoadIndex: (newIndex: number) => void;
};