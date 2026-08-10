import { createServer } from 'node:http';
import app from '../src/app.js';

export default createServer(app);
