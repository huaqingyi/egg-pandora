import { Application } from 'egg';
import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, join, sep } from 'path';
import _ from './constant';
import { map, groupBy } from 'lodash';
import swaggerUI from 'swagger-ui-koa';
import convert from 'koa-convert';
import mount from 'koa-mount';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export interface SwaggerOption {
    dirScanner: string;
    DOCJSONPath: string;
    DOCPath: string;
    apiInfo: {
        title: string;
        description: string;
        version: string;
    };
    schemes?: string[];
    consumes?: string[];
    produces?: string[];
    securityDefinitions: {
        apikey?: { type: string; name: string; in: string; } | any;
        oauth2?: {
            type: string;
            tokenUrl: string;
            flow: string;
            scopes: { [x: string]: string; },
        } | any;
    };
    enableSecurity?: boolean;
    enable?: boolean;
}

export class Document {

    constructor(
        private app: Application,
        private config?: SwaggerOption,
    ) {
        this.buildDocument(this.app);
    }

    public buildDocument(app: Application) {
        // config
        const swagger: any = this.config || { enable: false };
        if (!swagger || swagger.enable === false) { return {}; }

        const securitys: any[] = [];
        let tag_path: any = {
            tags: [],
            paths: {},
        };

        // 允许使用验证
        if (swagger.enableSecurity) {
            // 获取定义的安全验证名称
            for (const security in swagger.securityDefinitions) {
                securitys.push(security);
            }
        }

        const filepath = join(app.config.baseDir, swagger.dirScanner);

        // 递归获取 tags&paths
        tag_path = this.parse(filepath, securitys, swagger);

        // build document
        const DOCUMENT = {
            host: '',
            swagger: _.SWAGGERVERSION,
            basePath: swagger.basePath,
            info: swagger.apiInfo,
            schemes: swagger.schemes,
            tags: tag_path.tags,
            paths: tag_path.paths,
            securityDefinitions: swagger.securityDefinitions,
            definitions: validationMetadatasToSchemas(),
        };

        // console.log(DOCUMENT.paths['/home/index'].post);

        app.use(swaggerUI.serve);
        app.use(convert(mount(`/${swagger.DOCPath}`.replace('//', '/'), swaggerUI.setup(DOCUMENT))));
        app.use(convert(mount(`/${swagger.DOCJSONPath}`.replace('//', '/'), async ctx => {
            ctx.body = DOCUMENT;
        })));

        return DOCUMENT;
    }

    public generateCommentBlocks(filePath: string) {
        const buffer = readFileSync(filePath);
        const fileString = buffer.toString();
        const block_regex = /\/\*\*([\s\S]*?)\*\//gm;
        const blocks = fileString.match(block_regex);
        if (blocks) {
            const result = blocks.filter(value => {
                return value.indexOf('ontroller') > -1 || value.indexOf('outer') > -1 || value.indexOf('gnore') > -1;
            });
            return result;
        }
        return [];
    }

    public getComment(commentBlock, regex) {
        const result: any[] = [];
        const comment_lines = commentBlock.match(regex);
        if (comment_lines) {
            for (const comment_line of comment_lines) {
                result.push(comment_line.slice(1, comment_line.length - 1).replace('\r', '').split(' '));
            }
            return result;
        }
        return false;
    }

    public hasController(block: any) {
        return block.indexOf('@Controller') > -1 || block.indexOf('@controller') > -1;
    }

    public generateAPIFunc(filepath: string) {
        let func: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let obj = require(filepath);
        if (extname(filepath) === '.ts') {
            obj = obj.default;
        }

        const instance = obj.prototype || obj;
        func = Object.getOwnPropertyNames(instance).map(key => {
            return key;
        });

        if (func[0] === 'constructor') {
            func.shift();
        }

        return func;
    }

    public isIgnore(block: string) {
        return block.indexOf('@Ignore') > -1 || block.indexOf('@ignore') > -1;
    }

    public generateSummary(block: string) {
        let summary = '';
        const summarys = this.getComment(block, _.SUMMARY);
        if (summarys) {
            let m = 1;
            while (summarys[0][m]) {
                summary = summary + summarys[0][m] + ' ';
                m++;
            }
        }
        return summary;
    }

    public generateRequest(block: string, swagger: any) {
        let request: any[] = [];
        const produceComments = this.getComment(block, _.REQUEST);
        if (produceComments) {
            for (const item of produceComments) {
                const rqs: any[] = [];
                for (const key in item) {
                    if (Number(key) === 0) continue;
                    rqs.push(item[key]);
                }
                request.push(rqs);
            }
        } else {
            request = swagger.request;
        }
        return request;
    }

    public formatRequest(request: string[][]) {
        const { query, body, formData, path } = groupBy(map(request, ([rtype, type, name, desc, example, required]) => {
            if (rtype === 'formdata') { rtype = 'formData'; }
            return { name, type, required: !(required === 'false' || required === 'no'), in: rtype, description: desc, example };
        }), 'in');
        let rbody: any = { type: 'object', properties: {}, required: [] };
        if (!formData) {
            if (body) {
                map(body, (b: any) => {
                    rbody.properties[b.name] = { type: b.type, description: b.description };
                    if (b.example) { rbody.properties[b.name].example = b.example; }
                    if (b.required === true) { rbody.required.push(b.name); }
                });
                rbody = [{ name: 'data', in: 'body', schema: rbody }];
            } else {
                rbody = [];
            }
        } else {
            if (body) {
                rbody = map(body, b => ({ ...b, in: 'formData' }));
            } else rbody = [];
        }
        return [...(path || []), ...(query || []), ...(formData || []), ...rbody];
    }

    public generateResponse(block: string, swagger: any) {
        let response: any[] = [];
        const produceComments = this.getComment(block, _.RESPONSE);
        if (produceComments) {
            for (const item of produceComments) {
                const rqs: any[] = [];
                for (const key in item) {
                    if (Number(key) === 0) continue;
                    rqs.push(item[key]);
                }
                response.push(rqs);
            }
        } else {
            response = swagger.response;
        }
        return response;
    }

    public generateDescription(block: string) {
        let description: any = '';
        const descriptions = this.getComment(block.replace(/^\s+\*\s+^/gm, '\n').replace(/^\s+\*\s*/gm, ''), _.DESCRIPTION);
        if (descriptions) {
            let m = 1;
            while (descriptions[0][m]) {
                description = description + descriptions[0][m] + ' ';
                m++;
            }
        }
        return description;
    }

    public generateConsumes(block: string, swagger: any) {
        let consumes: any[] = [];
        const consumeComments = this.getComment(block, _.CONSUME);
        if (consumeComments) {
            for (const item of consumeComments) {
                for (const key in item) {
                    if (Number(key) === 0) continue;
                    consumes.push(item[key]);
                }
            }
        } else {
            consumes = swagger.consumes;
        }
        return consumes;
    }

    public generateProduces(block: string, swagger: any) {
        let produces: any[] = [];
        const produceComments = this.getComment(block, _.PRODUCE);
        if (produceComments) {
            for (const item of produceComments) {
                for (const key in item) {
                    if (Number(key) === 0) continue;
                    produces.push(item[key]);
                }
            }
        } else {
            produces = swagger.produces;
        }
        return produces;
    }

    public generateSecurity(block, securitys, swagger) {
        const securityDoc: any[] = [];
        for (const security of securitys) {
            if (block.indexOf(`@${security}`) > -1) {
                const securityItem = {};
                if (swagger.securityDefinitions[security].type === 'apiKey') {
                    securityItem[security] = [];
                    securityItem[security].push(swagger.securityDefinitions[security]);
                }
                if (swagger.securityDefinitions[security].type === 'oauth2') {
                    securityItem[security] = [];
                    Object.keys(swagger.securityDefinitions[security].scopes).forEach(i => {
                        securityItem[security].push(i);
                    });
                }
                securityDoc.push(securityItem);
            }
        }
        return securityDoc;
    }

    public isDeprecated(block: string) {
        return block.indexOf('@Deprecated') > -1 || block.indexOf('@deprecated') > -1;
    }

    public parse(fileDir, securitys, swagger) {
        // 已存在tag集合
        const tagNames: string[] = [];
        let tags: any[] = [];
        const paths: any = {};
        const names: any = readdirSync(fileDir);
        for (const name of names) {

            const filepath = join(fileDir, name);
            const stat = statSync(filepath);

            if (stat.isDirectory()) {
                const subPath = this.parse(filepath, securitys, swagger);
                // 合并子目录的扫描结果
                tags = tags.concat(subPath.tags);
                Object.assign(paths, subPath.paths);
                continue;
            }

            if (stat.isFile() && ['.js', '.ts'].indexOf(extname(name)) !== -1) {

                const fextname = extname(name);
                if (fextname === '.ts') {
                    const jsFile = name.replace('.ts', '.js');
                    if (names.indexOf(jsFile) >= 0) {
                        continue;
                    }
                }

                const blocks = this.generateCommentBlocks(filepath);

                // 如果第一个注释块不包含@controller不对该文件注释解析
                if (blocks.length === 0 || !this.hasController(blocks[0])) continue;

                // 当前注释块集合的所属tag-group, 并添加至swagger.tags中
                const controller = this.getComment(blocks[0], _.CONTROLLER)[0];
                let tagName = controller[1] ? controller[1] : name.split(/\.(js|ts)/)[0];
                if (tagNames.includes(tagName)) {
                    tagName = tagName + '_' + tagNames.length;
                }
                tagNames.push(tagName);

                tags.push({ name: tagName, description: controller[2] ? controller[2] : '' });

                const func = this.generateAPIFunc(filepath);
                const bundler: any = {
                    filePath: filepath,
                    routers: [],
                };

                const routerlist: any[] = [];
                for (let i = 1; i < blocks.length; i++) {

                    if (this.isIgnore(blocks[i])) continue;

                    const direct = `${filepath.split(/\.(js|ts)/)[0].split('app')[1].substr(1)}`;
                    // 解析路由
                    const routers = this.getComment(blocks[i], _.ROUTER);
                    if (routers) {
                        const path_method: any = {};
                        path_method.tags = [tagName];
                        path_method.summary = this.generateSummary(blocks[i]);
                        path_method.description = this.generateDescription(blocks[i]);
                        path_method.operationId = `${direct.replace(sep, '-')}-${func[i - 1]}`;
                        path_method.consumes = this.generateConsumes(blocks[i], swagger);
                        path_method.produces = this.generateProduces(blocks[i], swagger);

                        const request = this.generateRequest(blocks[i], swagger);
                        path_method.parameters = this.formatRequest(request);

                        const response = this.generateResponse(blocks[i], swagger);
                        // console.log(response, validationMetadatasToSchemas());
                        path_method.responses = {};
                        map(response, ([code, jname]) => {
                            if (code) {
                                if (!jname) { jname = 'object'; }
                                let jtype = validationMetadatasToSchemas()[jname] || jname;
                                if (jname === 'object') { jtype = { type: 'object' }; }
                                if (jname === 'array') { jtype = { type: 'array' }; }
                                if (jname === 'boolean') { jtype = { type: 'boolean', enum: [true, false] }; }
                                if (jname === 'number') { jtype = { type: 'number' }; }
                                path_method.responses[code] = jtype;
                            }
                        });

                        path_method.security = this.generateSecurity(blocks[i], securitys, swagger);
                        path_method.deprecated = this.isDeprecated(blocks[i]);

                        if (!routerlist.includes(routers[0][2])) {
                            paths[routers[0][2]] = {};
                        }

                        routerlist.push(routers[0][2]);
                        paths[routers[0][2]][routers[0][1].toLowerCase()] = path_method;

                        const router = {
                            method: routers[0][1].toLowerCase(),
                            route: routers[0][2],
                            func: func[i - 1],
                        };
                        bundler.routers.push(router);
                    }
                }
            }
        }

        return {
            tags,
            paths,
        };
    }
}
