import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const regexp = /[^a-zA-Z0-9]/g;
const sep = '-';

const getFilename = (url) => {
  const { hostname, pathname, search } = new URL(url);
  const basename = [hostname, pathname, search]
    .join('')
    .replaceAll(regexp, sep);
  return `${basename}.html`;
};

const loadPage = (url, outDir = '.') => {
  let filepath;

  const result = Promise.resolve()
    .then(() => getFilename(url))
    .then((filename) => {
      filepath = path.resolve(process.cwd(), outDir, filename);
    })
    .then(() => axios.get(url))
    .then(({ data }) => fs.writeFile(filepath, data))
    .then(() => ({ filepath }));

  return result;
};

export default loadPage;
