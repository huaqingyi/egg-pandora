/*
 * @FilePath: /egg-pandora/example/config/plugin.ts
 * @Descripttion: 
 * @version: 
 * @Author: 易华青
 * @Date: 2020-11-19 16:22:11
 * @LastEditors: huaqingyi
 * @LastEditTime: 2020-11-19 20:12:58
 * @debugger: 
 */
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    pandora: {
        enable: true,
        package: 'egg-pandora',
    },
    multipart: {
        enable: true,
        package: 'egg-multipart',
    },
    // jwt: {
    //     enable: true,
    //     package: 'egg-jwt'
    // },
    passport: {
        enable: true,
        package: 'egg-passport',
    },
    passportGithub: {
        enable: true,
        package: 'egg-passport-github',
    },
};

export default plugin;
