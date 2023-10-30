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
  const filename = getFilename(url);
  const filepath = path.resolve(process.cwd(), outDir, filename);

  return axios.get(url)
    .then(({ data }) => fs.writeFile(filepath, data))
    .then(() => ({ filepath }));
};

export default loadPage;
