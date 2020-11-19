/*
 * @FilePath: /egg-pandora/example/config/plugin.ts
 * @Descripttion:
 * @version:
 * @Author: 易华青
 * @Date: 2020-11-16 10:46:55
 * @LastEditors: huaqingyi
 * @LastEditTime: 2020-11-19 16:27:45
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
    }
};

export default plugin;
