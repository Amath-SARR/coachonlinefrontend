export const sortByStringKey = (array, key, options = {}) => {
  const { increasingly = true } = options;
  try {
    const arrayCopy = JSON.parse(JSON.stringify(array));
    return arrayCopy.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (typeof a[key] === 'string') {
        valA = a[key]?.toLowerCase();
        valB = b[key]?.toLowerCase();
      }
      if (valA < valB) {
        return increasingly ? -1 : 1;
      }
      if (valA > valB) {
        return increasingly ? 1 : -1;
      }
      return 0;
    });
  } catch (e) {
    console.warn(e);
    return array;
  }
};

export const getSlicedDataPerPage = (data, page, itemsPerPage) =>
  data?.slice((page - 1) * itemsPerPage, page * itemsPerPage);
