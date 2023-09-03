export const writeToStorage = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    // process.env.NODE_ENV !== 'production' &&
    //   console.log('WRITING TO STORAGE', { [key]: data });
  } catch (e) {
    console.log('Attempt to write to storage has failed', { key, data });
    console.warn('Failed to write to storage', e);
  }
};

export const readFromStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    // process.env.NODE_ENV !== 'production' &&
    //   console.log('READING FROM STORAGE', { [key]: data });
    return data;
  } catch (e) {
    console.log('Attempt to read from storage has failed', { key });
    console.warn('Failed to read from storage', e);
    return null;
  }
};
