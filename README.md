# egg-pandora

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-pandora.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-pandora
[travis-image]: https://img.shields.io/travis/eggjs/egg-pandora.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-pandora
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-pandora.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-pandora?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-pandora.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-pandora
[snyk-image]: https://snyk.io/test/npm/egg-pandora/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-pandora
[download-image]: https://img.shields.io/npm/dm/egg-pandora.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-pandora

<!--
Description here.
-->

# Pandora & EGG JS
* npm i egg-pandoras --save
## Pandora 套件说明
* 添加 Dto/Dao AOP 切面
* 添加 Swagger JSDOC 注释生成文档
* 添加 router 路由修饰器
* 后续迭代更多功能
```bash
$ npm i egg-pandora --save
```

## Usage

```typescript
// {app_root}/config/plugin.ts
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
```

## Configuration

```typescript
// {app_root}/config/config.default.ts
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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
            // typeorm: false,
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
        security: {
            xframe: { enable: false },
            csrf: { enable: false },
        },
    };
};
```


## 基本使用
* 启动 Pandora 套件
* app/router.ts
```typescript
import { Application } from 'egg';
import { router } from 'egg-pandoras';

export default (app: Application) => router(app);
```
* swagger 通过 注释生成 可 配合 AOP 切面使用
* AOP 切面 自动把 validator-class 转成 jsonschema
* 这里注意一下 swagger 中使用 AOP 切面直接备注 切面名即可
* app/controller/home.ts
```typescript
import { Controller } from 'egg';
import { createWriteStream } from 'fs';
import { isArray } from 'lodash';
import { join } from 'path';
import pump from 'pump';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandoras';
import { HomeDataDto } from '../dto/home';

/**
 * @controller home
 */
@RestController
export default class extends Controller {

    /**
     * @summary 创建资源
     * @router POST /home/index/{id}/{uid}
     * @request path string id ID
     * @request path string uid UID
     * @request query string test 测试
     * @request query string test1 测试1
     * @request formdata file file 文件 false
     * @request formdata file file1 文件1 false
     * @request body string name 名字
     * @request body string age 年龄
     * @consumes multipart/form-data
     * @apikey
     */
    @RequestMapping({ path: 'index/:id/:uid', methods: [RequestMethod.POST] })
    public async index() {
        console.log('path', this.ctx.params);
        console.log('query', this.ctx.request.query);
        console.log('header', this.ctx.request.headers);
        // console.log('body', this.ctx.request.body);
        const parts = this.ctx.multipart();
        const body: { [x: string]: string } = {};
        let stream;
        while ((stream = await parts()) != null) {
            if (isArray(stream)) {
                body[stream[0]] = stream[1];
            } else if (stream.filename) {
                const filename = stream.filename.toLowerCase();
                const target = join(this.config.baseDir, 'app/public', filename);
                const writeStream = createWriteStream(target);
                await pump(stream, writeStream);
            }
        }
        console.log('body', body);
        const { ctx } = this;
        console.log(await ctx.repo.User.count());
        console.log(await ctx.repo.User.queryAll());
        console.log(await ctx.vaildAOP(HomeDataDto, {}));

        // ctx.body = await ctx.service.test.sayHi('egg');
        ctx.body = await ctx.service.test.test();
    }
}
```
* entity 数据模型
* 这里注意一下 sql 和 QueryBuilder 分在此层 单独抽离略嫌麻烦
* 习惯了非常好用哦 非常推荐
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TypeOrm } from 'egg-pandora';

@Entity()
export class User extends TypeOrm<User> {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    public async queryAll() {
        return this.findAndCount();
    }
}
```

* AOP 切面
* 这里支持 [class-validator-jsonschema](https://github.com/epiphone/class-validator-jsonschema) 注释说明
* app/dto/home.ts
```typescript
import {
    Contains, IsInt, Length, IsEmail, IsFQDN, Dto,
    IsDate, Min, Max, ValidateNested, IsString, IsEmpty,
} from 'egg-pandoras';

export class Test1 extends Dto {

    @Length(10, 20)
    public title!: string;

    @Contains('hello')
    public text!: string;

    @IsInt()
    @Min(0)
    @Max(10)
    public rating!: number;

    @IsEmail()
    public email!: string;

    @IsFQDN()
    public site!: string;

    @IsDate()
    public createDate!: Date;
}

export class HomeDataDto extends Dto {

    @IsString()
    public error!: string;
    @IsInt()
    public errno!: number;

    @ValidateNested()
    @IsEmpty()
    public data?: Test1;
}

```
* logic 层 做数据验证 这里对用 controller 的 文件名 和目录结构
* logic 移植于 thinkjs 可参考 [thinkjs logic](https://thinkjs.org/zh-cn/doc/3.0/logic.html)
* context 添加 this.ctx.param(name?:string) 和 this.ctx.post(name?: string) this.ctx.file(name?:string)
* 用法与 thinkjs 一致
* app/logic/user.ts
```typescript
import { Logic, PandoraLogicRules, RequestMethod } from 'egg-pandora';
import { Context } from 'egg';

export default class extends Logic {

    constructor(ctx: Context) {
        super(ctx);
        console.log('logic');
    }

    public async index() {
        const rules: PandoraLogicRules = {
            name: {
                string: true,
                required: true,
                method: [RequestMethod.POST],
            }
        };
        const valid = this.validate(rules);
        console.log(111, valid);
        this.ctx.body = `error`;
        return false;
    }
}
```
