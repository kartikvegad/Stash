export const isValidHex = (value: string): boolean =>
  /^#[0-9A-Fa-f]{6}$/.test(value);

export const normalizeHex = (value: string): string =>
  value.startsWith('#') ? value : `#${value}`;
