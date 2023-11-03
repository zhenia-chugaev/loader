const binaryConfig = {
  responseType: 'arraybuffer',
};

const configs = {
  '.png': binaryConfig,
  '.jpg': binaryConfig,
  '.jpeg': binaryConfig,
  '.svg': binaryConfig,
};

const getConfig = (ext) => configs[ext] ?? {};

export default getConfig;
