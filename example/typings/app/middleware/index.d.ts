// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportException from '../../../app/middleware/exception';

declare module 'egg' {
  interface IMiddleware {
    exception: typeof ExportException;
  }
}
