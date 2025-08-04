

export function defineNameSpaces<const T extends Record<string, string>>(obj: T) {
  return obj;
}

export type ValueOf<T> = T[keyof T];
