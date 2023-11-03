import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (fixtureName) => path
  .join(__dirname, '..', '__fixtures__', fixtureName);

const readFixture = (fixtureName, encoding = null) => {
  const fixturePath = getFixturePath(fixtureName);
  return fs.readFile(fixturePath, encoding);
};

export default readFixture;
