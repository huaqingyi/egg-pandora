import { EggPlugin } from 'egg';
import 'tsconfig-paths/register';

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
    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
};

export default plugin;
