"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const constant_1 = __importDefault(require("./constant"));
const lodash_1 = require("lodash");
const swagger_ui_koa_1 = __importDefault(require("swagger-ui-koa"));
const koa_convert_1 = __importDefault(require("koa-convert"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
class Document {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.buildDocument(this.app);
    }
    buildDocument(app) {
        // config
        const swagger = this.config || { enable: false };
        if (!swagger || swagger.enable === false) {
            return {};
        }
        const securitys = [];
        let tag_path = {
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
        const filepath = path_1.join(app.config.baseDir, swagger.dirScanner);
        // 递归获取 tags&paths
        tag_path = this.parse(filepath, securitys, swagger);
        // build document
        const DOCUMENT = {
            host: '',
            swagger: constant_1.default.SWAGGERVERSION,
            basePath: swagger.basePath,
            info: swagger.apiInfo,
            schemes: swagger.schemes,
            tags: tag_path.tags,
            paths: tag_path.paths,
            securityDefinitions: swagger.securityDefinitions,
            definitions: class_validator_jsonschema_1.validationMetadatasToSchemas(),
        };
        // console.log(DOCUMENT.paths['/home/index'].post);
        app.use(swagger_ui_koa_1.default.serve);
        app.use(koa_convert_1.default(koa_mount_1.default(`/${swagger.DOCPath}`.replace('//', '/'), swagger_ui_koa_1.default.setup(DOCUMENT))));
        app.use(koa_convert_1.default(koa_mount_1.default(`/${swagger.DOCJSONPath}`.replace('//', '/'), async (ctx) => {
            ctx.body = DOCUMENT;
        })));
        return DOCUMENT;
    }
    generateCommentBlocks(filePath) {
        const buffer = fs_1.readFileSync(filePath);
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
    getComment(commentBlock, regex) {
        const result = [];
        const comment_lines = commentBlock.match(regex);
        if (comment_lines) {
            for (const comment_line of comment_lines) {
                result.push(comment_line.slice(1, comment_line.length - 1).replace('\r', '').split(' '));
            }
            return result;
        }
        return false;
    }
    hasController(block) {
        return block.indexOf('@Controller') > -1 || block.indexOf('@controller') > -1;
    }
    generateAPIFunc(filepath) {
        let func = [];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let obj = require(filepath);
        if (path_1.extname(filepath) === '.ts') {
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
    isIgnore(block) {
        return block.indexOf('@Ignore') > -1 || block.indexOf('@ignore') > -1;
    }
    generateSummary(block) {
        let summary = '';
        const summarys = this.getComment(block, constant_1.default.SUMMARY);
        if (summarys) {
            let m = 1;
            while (summarys[0][m]) {
                summary = summary + summarys[0][m] + ' ';
                m++;
            }
        }
        return summary;
    }
    generateRequest(block, swagger) {
        let request = [];
        const produceComments = this.getComment(block, constant_1.default.REQUEST);
        if (produceComments) {
            for (const item of produceComments) {
                const rqs = [];
                for (const key in item) {
                    if (Number(key) === 0)
                        continue;
                    rqs.push(item[key]);
                }
                request.push(rqs);
            }
        }
        else {
            request = swagger.request;
        }
        return request;
    }
    formatRequest(request) {
        const { query, body, formData, path } = lodash_1.groupBy(lodash_1.map(request, ([rtype, type, name, desc, example, required]) => {
            if (rtype === 'formdata') {
                rtype = 'formData';
            }
            return { name, type, required: !(required === 'false' || required === 'no'), in: rtype, description: desc, example };
        }), 'in');
        let rbody = { type: 'object', properties: {}, required: [] };
        if (!formData) {
            if (body) {
                lodash_1.map(body, (b) => {
                    rbody.properties[b.name] = { type: b.type, description: b.description };
                    if (b.example) {
                        rbody.properties[b.name].example = b.example;
                    }
                    if (b.required === true) {
                        rbody.required.push(b.name);
                    }
                });
                rbody = [{ name: 'data', in: 'body', schema: rbody }];
            }
            else {
                rbody = [];
            }
        }
        else {
            if (body) {
                rbody = lodash_1.map(body, b => ({ ...b, in: 'formData' }));
            }
            else
                rbody = [];
        }
        return [...(path || []), ...(query || []), ...(formData || []), ...rbody];
    }
    generateResponse(block, swagger) {
        let response = [];
        const produceComments = this.getComment(block, constant_1.default.RESPONSE);
        if (produceComments) {
            for (const item of produceComments) {
                const rqs = [];
                for (const key in item) {
                    if (Number(key) === 0)
                        continue;
                    rqs.push(item[key]);
                }
                response.push(rqs);
            }
        }
        else {
            response = swagger.response;
        }
        return response;
    }
    generateDescription(block) {
        let description = '';
        const descriptions = this.getComment(block.replace(/^\s+\*\s+^/gm, '\n').replace(/^\s+\*\s*/gm, ''), constant_1.default.DESCRIPTION);
        if (descriptions) {
            let m = 1;
            while (descriptions[0][m]) {
                description = description + descriptions[0][m] + ' ';
                m++;
            }
        }
        return description;
    }
    generateConsumes(block, swagger) {
        let consumes = [];
        const consumeComments = this.getComment(block, constant_1.default.CONSUME);
        if (consumeComments) {
            for (const item of consumeComments) {
                for (const key in item) {
                    if (Number(key) === 0)
                        continue;
                    consumes.push(item[key]);
                }
            }
        }
        else {
            consumes = swagger.consumes;
        }
        return consumes;
    }
    generateProduces(block, swagger) {
        let produces = [];
        const produceComments = this.getComment(block, constant_1.default.PRODUCE);
        if (produceComments) {
            for (const item of produceComments) {
                for (const key in item) {
                    if (Number(key) === 0)
                        continue;
                    produces.push(item[key]);
                }
            }
        }
        else {
            produces = swagger.produces;
        }
        return produces;
    }
    generateSecurity(block, securitys, swagger) {
        const securityDoc = [];
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
    isDeprecated(block) {
        return block.indexOf('@Deprecated') > -1 || block.indexOf('@deprecated') > -1;
    }
    parse(fileDir, securitys, swagger) {
        // 已存在tag集合
        const tagNames = [];
        let tags = [];
        const paths = {};
        const names = fs_1.readdirSync(fileDir);
        for (const name of names) {
            const filepath = path_1.join(fileDir, name);
            const stat = fs_1.statSync(filepath);
            if (stat.isDirectory()) {
                const subPath = this.parse(filepath, securitys, swagger);
                // 合并子目录的扫描结果
                tags = tags.concat(subPath.tags);
                Object.assign(paths, subPath.paths);
                continue;
            }
            if (stat.isFile() && ['.js', '.ts'].indexOf(path_1.extname(name)) !== -1) {
                const fextname = path_1.extname(name);
                if (fextname === '.ts') {
                    const jsFile = name.replace('.ts', '.js');
                    if (names.indexOf(jsFile) >= 0) {
                        continue;
                    }
                }
                const blocks = this.generateCommentBlocks(filepath);
                // 如果第一个注释块不包含@controller不对该文件注释解析
                if (blocks.length === 0 || !this.hasController(blocks[0]))
                    continue;
                // 当前注释块集合的所属tag-group, 并添加至swagger.tags中
                const controller = this.getComment(blocks[0], constant_1.default.CONTROLLER)[0];
                let tagName = controller[1] ? controller[1] : name.split(/\.(js|ts)/)[0];
                if (tagNames.includes(tagName)) {
                    tagName = tagName + '_' + tagNames.length;
                }
                tagNames.push(tagName);
                tags.push({ name: tagName, description: controller[2] ? controller[2] : '' });
                const func = this.generateAPIFunc(filepath);
                const bundler = {
                    filePath: filepath,
                    routers: [],
                };
                const routerlist = [];
                for (let i = 1; i < blocks.length; i++) {
                    if (this.isIgnore(blocks[i]))
                        continue;
                    const direct = `${filepath.split(/\.(js|ts)/)[0].split('app')[1].substr(1)}`;
                    // 解析路由
                    const routers = this.getComment(blocks[i], constant_1.default.ROUTER);
                    if (routers) {
                        const path_method = {};
                        path_method.tags = [tagName];
                        path_method.summary = this.generateSummary(blocks[i]);
                        path_method.description = this.generateDescription(blocks[i]);
                        path_method.operationId = `${direct.replace(path_1.sep, '-')}-${func[i - 1]}`;
                        path_method.consumes = this.generateConsumes(blocks[i], swagger);
                        path_method.produces = this.generateProduces(blocks[i], swagger);
                        const request = this.generateRequest(blocks[i], swagger);
                        path_method.parameters = this.formatRequest(request);
                        const response = this.generateResponse(blocks[i], swagger);
                        // console.log(response, validationMetadatasToSchemas());
                        path_method.responses = {};
                        lodash_1.map(response, ([code, jname]) => {
                            if (code) {
                                if (!jname) {
                                    jname = 'object';
                                }
                                let jtype = class_validator_jsonschema_1.validationMetadatasToSchemas()[jname] || jname;
                                if (jname === 'object') {
                                    jtype = { type: 'object' };
                                }
                                if (jname === 'array') {
                                    jtype = { type: 'array' };
                                }
                                if (jname === 'boolean') {
                                    jtype = { type: 'boolean', enum: [true, false] };
                                }
                                if (jname === 'number') {
                                    jtype = { type: 'number' };
                                }
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
exports.Document = Document;

//# sourceMappingURL=../../../sourcemaps/app/pandora/swagger/document.js.map
