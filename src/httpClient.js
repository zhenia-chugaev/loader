import axios from 'axios';
import logger from 'axios-debug-log';
import debug from 'debug';

const client = axios.create();
const clientLogger = debug('axios');

logger.addLogger(client, clientLogger);

export default client;
