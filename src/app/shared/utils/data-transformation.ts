export const removeArrayDuplicates = <
  TItem extends object,
  TKey extends keyof TItem
>(
  array: TItem[],
  key: TKey
) => {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      return true;
    }
  });
};

export const removeFalsyValues = (obj: { [key: string]: any }) => {
  const result: { [key: string]: any } = {};
  for (let key in obj) {
    if (obj[key]) result[key] = obj[key];
  }
  return result;
};
