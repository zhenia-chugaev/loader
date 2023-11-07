import path from 'path';

const sep = '-';
const regexp = /[^a-zA-Z0-9]/g;

const getAssetName = (url) => {
  const { hostname, pathname } = new URL(url);
  const basename = path.basename(pathname);
  const dirname = path.dirname(pathname);
  const name = [
    hostname,
    dirname === '/' ? '' : dirname,
  ].join('').replaceAll(regexp, sep);
  return `${name}${sep}${basename}`;
};

const getName = (url, suffix = '') => {
  const { hostname, pathname, search } = new URL(url);

  if (path.extname(pathname)) {
    return getAssetName(url);
  }

  const name = [
    hostname,
    pathname === '/' ? '' : pathname,
    search,
  ].join('').replaceAll(regexp, sep);

  return `${name}${suffix}`;
};

export default getName;
