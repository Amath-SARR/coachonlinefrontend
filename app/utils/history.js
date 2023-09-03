import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
export default history;

export const replaceWithBackground = ({ path, history, location = { pathname: '/' } }) => {
  console.log(location);
  history.replace(path, {
    background: location.state?.background || location,
  });
};

export const navigateWithBackground = ({ path, history, location = { pathname: '/' } }) => {
  history.push(path, {
    background: location.state?.background || location,
  });
};

export const replaceFromBackground = ({ history, location }) => {
  history.replace({
    ...(location?.state?.background || {}),
    pathname: location?.state?.background?.pathname || '/',
  });
};
