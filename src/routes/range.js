export const rangeAN = [
  ...Array.from({ length: 10 }, (_, i) => String(i)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65)),
];
