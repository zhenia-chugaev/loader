import errors from 'errno';

const messages = {
  network: (url) => `failed to load resource ${url}`,
  fs: (path) => `failed to write to the disk ${path}`,
};

const isLibuvError = (error) => errors.code[error.code];

const isNetworkError = (error) => error.isAxiosError;

const isFsError = (error) => error.path;

class LoaderError extends Error {
  constructor(error) {
    const messageParts = [];

    if (isLibuvError(error)) {
      const { description } = errors.code[error.code];
      messageParts.push(description);
    }

    if (isNetworkError(error)) {
      const { url } = error.config;
      messageParts.push(
        messageParts.length ? url : messages.network(url),
      );
    }

    if (isFsError(error)) {
      const { path } = error;
      messageParts.push(
        messageParts.length ? path : messages.fs(path),
      );
    }

    const message = messageParts.join(' ');

    super(message || error.message.toLowerCase());

    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }
}

export default LoaderError;
