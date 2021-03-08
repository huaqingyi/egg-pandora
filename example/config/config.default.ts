import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { tmpdir } from 'os';
import { join } from 'path';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1605494805703_9866';

    // add your egg config in here
    config.middleware = [];

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    };

    const swagger = {
        dirScanner: './app/controller',
        DOCJSONPath: '/swagger.json',
        DOCPath: '/swagger.io',
        apiInfo: {
            title: '测试用例',
            description: 'API Swagger 用例',
            version: '1.0.0',
        },
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            apikey: {
                type: 'apiKey',
                name: 'accesstoken',
                in: 'header',
            },
            // oauth2: {
            //   type: 'oauth2',
            //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
            //   flow: 'password',
            //   scopes: {
            //     'write:access_token': 'write access_token',
            //     'read:access_token': 'read access_token',
            //   },
            // },
        },
        enableSecurity: true,
        enable: true,
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
        pandora: {
            router: {
                autoloader: true,
            },
            swagger,
        },
        security: {
            xframe: { enable: false },
            csrf: { enable: false },
        },
        typeorm: {
            type: 'mysql',
            host: '127.0.0.1',
            port: 33066,
            username: 'root',
            password: 'jzzs2020',
            database: 'jzzs',
            synchronize: true,
            logging: false,
            entities: ['app/entity/**/*.ts'],
            migrations: ['app/migration/**/*.ts'],
            subscribers: ['app/subscriber/**/*.ts'],
            cli: {
                entitiesDir: 'app/entity',
                migrationsDir: 'app/migration',
                subscribersDir: 'app/subscriber',
            },
        },
        multipart: {
            mode: 'file',
            tmpdir: join(tmpdir(), 'pandora', appInfo.name),
            cleanSchedule: {
                // run tmpdir clean job on every day 04:30 am
                // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
                cron: '0 30 4 * * *',
            },
        },
        // jwt: {
        //     secret: '123456'
        // },
    };
};
