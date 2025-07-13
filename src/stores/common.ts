export type SetterMethods<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export interface IndexDependentSettings {
  saveAndLoadIndex: (newIndex: number) => void;
}

export interface UrlAble {
  getUrlSnippet: () => string;
  setFromUrlSnippet: (urlSnippet: string) => void;
}

export const generateUrlSnippet = <T extends object>(
  obj: T,
  snippetID: string,
  includedKeys: (keyof T)[],
  stringConverters: Partial<Record<keyof T, Record<string, string>>> = {}
): string => {
  const adjustedValues = includedKeys.map((key) => {
    const value = obj[key];
    if (typeof value === "boolean") {
      return Number(value);
    }

    if (typeof value === "string" && stringConverters[key]) {
      return stringConverters[key][value] ?? value;
    }

    return value;
  });
  return `${snippetID}~${adjustedValues.join("~")}`;
};

export const applyUrlSnippet = <T extends object>(
  snippet: string,
  obj: T,
  snippetID: string,
  includedKeys: (keyof T)[],
  stringConverters: Partial<Record<keyof T, Record<string, string>>> = {}
): T => {
  if (snippet[0] !== snippetID) {
    return obj;
  }

  const values = snippet.slice(2).split("~");

  for (const [i, key] of includedKeys.entries()) {
    const snippetVal = values[i];
    const currVal = obj[key];

    if (typeof currVal === "boolean") {
      obj[key] = Boolean(Number(snippetVal)) as T[typeof key];
    } else if (typeof currVal === "number") {
      obj[key] = Number(snippetVal) as T[typeof key];
    } else if (typeof currVal === "string" && stringConverters[key]) {
      const converter = stringConverters[key];
      let newVal = snippetVal;
      for (const convKey in converter) {
        if (converter[convKey] === snippetVal) {
          newVal = convKey;
          break;
        }
      }
      obj[key] = newVal as T[typeof key];
    } else {
      obj[key] = snippetVal as T[typeof key];
    }
  }

  return obj;
};
