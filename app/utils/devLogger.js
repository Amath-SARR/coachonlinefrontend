export const logger = (...rest) => {
  process.env.NODE_ENV !== 'production' && console.log(...rest);
}
