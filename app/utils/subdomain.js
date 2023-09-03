import { APPLICATION_URL } from '../config/env';

export default function () {
  const { hostname } = window.location;
  const hostArray = hostname.split('.');
  if (hostArray.length > 1 && !APPLICATION_URL.includes(hostArray[0])) {
    return hostArray[0];
  }
  return null;
}
