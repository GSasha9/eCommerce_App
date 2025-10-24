export const convertInputName = (inputName: string): string => {
  return inputName
    .split('-')
    .map((word, index) => (index === 0 ? word : `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`))
    .join('');
};
