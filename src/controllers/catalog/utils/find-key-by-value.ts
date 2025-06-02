export const findKeyByValue = (map: Map<string, string>, value: string): string | undefined => {
  for (const [key, val] of map.entries()) {
    console.log('val   ', val, 'value   ', value);

    if (val === value) {
      return key;
    }
  }

  return undefined;
};
