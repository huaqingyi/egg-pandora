"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEntityAndModel = exports.getEntityFromPath = exports.createTyingFile = exports.watchEntity = exports.formatPaths = exports.getTypingText = exports.writeTyping = exports.getModelName = exports.capitalizeFirstLetter = exports.connectDB = exports.handleConfig = exports.formatCode = void 0;
const path_1 = require("path");
const fs_jetpack_1 = require("fs-jetpack");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const chokidar_1 = require("chokidar");
const prettier_1 = require("prettier");
const fs_extra_1 = require("fs-extra");
const hasTsLoader = typeof require.extensions['.ts'] === 'function';
function formatCode(text) {
    return prettier_1.format(text, {
        semi: false,
        tabWidth: 2,
        singleQuote: true,
        parser: 'typescript',
        trailingComma: 'all',
    });
}
exports.formatCode = formatCode;
function handleConfig(config, _env) {
    if (hasTsLoader) {
        return config;
    }
    const keys = ['entities', 'migrations', 'subscribers'];
    for (const key of keys) {
        if (config[key]) {
            const newValue = config[key].map((item) => item.replace(/\.ts$/, '.js'));
            config[key] = newValue;
        }
    }
    return config;
}
exports.handleConfig = handleConfig;
async function connectDB(app) {
    const config = handleConfig(app.config.typeorm, app.config.env);
    typeorm_1.useContainer(typedi_1.Container);
    const connection = await typeorm_1.createConnection(config);
    app.context.connection = connection;
}
exports.connectDB = connectDB;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function getModelName(file) {
    const filename = file.split(path_1.sep).pop() || '';
    const name = capitalizeFirstLetter(filename.replace(/\.ts$|\.js$/g, ''));
    return name;
}
exports.getModelName = getModelName;
function writeTyping(path, text) {
    fs_extra_1.writeFileSync(path, formatCode(text), { encoding: 'utf8' });
}
exports.writeTyping = writeTyping;
function getTypingText(importText, repoText, entityText) {
    const tpl = `
import 'egg'
import { Repository, Connection } from 'typeorm'
${importText}
declare module 'egg' {
  interface Context {
    connection: Connection
    entity: {
      ${entityText}
    }
    repo: {
      ${repoText}
    }
  }
}
`;
    return tpl;
}
exports.getTypingText = getTypingText;
function formatPaths(files) {
    return files.map(file => {
        const name = getModelName(file);
        file = file.split(path_1.sep).join('/');
        const importPath = `../${file}`.replace(/\.ts$|\.js$/g, '');
        return {
            name,
            importPath,
        };
    });
}
exports.formatPaths = formatPaths;
function watchEntity(app) {
    const { baseDir } = app;
    const entityDir = path_1.join(baseDir, 'app', 'entity');
    const typingsDir = path_1.join(baseDir, 'typings');
    if (!fs_extra_1.existsSync(entityDir)) {
        return;
    }
    fs_extra_1.ensureDirSync(typingsDir);
    chokidar_1.watch(entityDir).on('all', (eventType) => {
        if (['add', 'change'].includes(eventType)) {
            createTyingFile(app);
        }
        if (['unlink'].includes(eventType)) {
            createTyingFile(app);
        }
    });
}
exports.watchEntity = watchEntity;
function createTyingFile(app) {
    const { baseDir } = app;
    const entityDir = path_1.join(baseDir, 'app', 'entity');
    const files = fs_jetpack_1.find(entityDir, { matching: '*.ts' });
    const typingPath = path_1.join(baseDir, 'typings', 'typeorm.d.ts');
    const pathArr = formatPaths(files);
    const importText = pathArr
        .map(i => `import { ${i.name} } from '${i.importPath}'`)
        .join('\n');
    // const repoText = pathArr
    //     .map(i => `${i.name}: Repository<${i.name}>`)
    //     .join('\n')
    const repoText = pathArr
        .map(i => `${i.name}: ${i.name}`)
        .join('\n');
    // TODO
    const entityText = pathArr.map(i => `${i.name}: any`).join('\n');
    const text = getTypingText(importText, repoText, entityText);
    writeTyping(typingPath, text);
}
exports.createTyingFile = createTyingFile;
function getEntityFromPath(app, entityPath) {
    const connection = app.context.connection;
    const fileModule = require(entityPath);
    const entities = Object.keys(fileModule).reduce((result, cur) => {
        try {
            // TODO: 太 hack
            connection.getMetadata(fileModule[cur]);
            if (!result.includes(fileModule[cur])) {
                return [...result, fileModule[cur]];
            }
            else {
                return result;
            }
        }
        catch {
            //
        }
        return result;
    }, []);
    if (!entities.length) {
        throw new Error(`${entityPath} 格式不正确，不存在 @entity`);
    }
    return entities[0];
}
exports.getEntityFromPath = getEntityFromPath;
async function loadEntityAndModel(app) {
    const { baseDir } = app;
    const entityDir = path_1.join(baseDir, 'app', 'entity');
    if (!fs_extra_1.existsSync(entityDir))
        return;
    const matching = hasTsLoader ? '*.ts' : '*.js';
    const files = fs_jetpack_1.find(entityDir, { matching });
    app.context.repo = {};
    app.context.entity = {};
    try {
        for (const file of files) {
            const entityPath = path_1.join(baseDir, file);
            const entity = getEntityFromPath(app, entityPath);
            const name = getModelName(file);
            const repo = typeorm_1.getRepository(entity);
            app.context.repo[name] = new Proxy(repo, {
                get(target, key) {
                    if (target[key]) {
                        return target[key];
                    }
                    return entity.prototype[key].bind(target);
                },
                set(target, key, value) {
                    target[key] = value;
                    return true;
                }
            });
            app.context.entity[name] = entity;
        }
    }
    catch (e) {
        app.logger.error(e);
    }
}
exports.loadEntityAndModel = loadEntityAndModel;

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/core.js.map
