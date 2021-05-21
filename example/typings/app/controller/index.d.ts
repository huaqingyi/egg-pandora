// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLogin from '../../../app/controller/login';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    login: ExportLogin;
    user: ExportUser;
  }
}
