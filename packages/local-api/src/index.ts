import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellRouter } from './routes/CellRoutes';

export const serve = (port: number, filename: string, dir: string, isProduction: boolean) => {
  const app = express()
  app.use(createCellRouter(dir, filename));
  if (isProduction) {
    const filePath = require.resolve('local-client/build/index.html');
    app.use(express.static(path.dirname(filePath)));
  } else {
    app.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
    }));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject).on('listening', () => {
      console.log(`Opened file ${filename}. Navigate to http://localhost:${port} to edit this file`);
    });
  });
}
