export type AttrHeight = {
  name: string;
  value: {
    key: string;
    label: string;
  };
};

export const isAttrHeightValue = (obj: AttrHeight): obj is AttrHeight => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'value' in obj &&
    typeof obj.value === 'object' &&
    'key' in obj.value &&
    'label' in obj.value &&
    typeof obj.value.key === 'string' &&
    typeof obj.value.label === 'string'
  );
};
