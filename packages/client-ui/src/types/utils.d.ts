export type RecursiveObjectKeyMapper<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? `${Prefix}${K & string}.${ObjectKeyMapper<T[K], ''>}` // Recursively build path
    : `${Prefix}${K & string}`;
}[keyof T];
export type ObjectKeyMapper<T, Prefix extends string = ''> = {
  [K in keyof T]: `${Prefix}${K & string}`;
}[keyof T];
