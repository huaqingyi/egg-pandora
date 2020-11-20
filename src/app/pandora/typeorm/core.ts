import { join, sep } from 'path';
import { find } from 'fs-jetpack';
import { Application } from 'egg';
import {
    createConnection,
    getRepository,
    Connection,
    useContainer,
} from 'typeorm';
import { Container } from 'typedi';

import { watch } from 'chokidar';
import { format } from 'prettier';
import { ensureDirSync, existsSync, writeFileSync } from 'fs-extra';

const hasTsLoader = typeof require.extensions['.ts'] === 'function';

export function formatCode(text: string) {
    return format(text, {
        semi: false,
        tabWidth: 2,
        singleQuote: true,
        parser: 'typescript',
        trailingComma: 'all',
    })
}

export function handleConfig(config: any, _env: string) {
    if (hasTsLoader) {
        return config
    }
    const keys = ['entities', 'migrations', 'subscribers']
    for (const key of keys) {
        if (config[key]) {
            const newValue = config[key].map((item: string) =>
                item.replace(/\.ts$/, '.js'),
            )
            config[key] = newValue
        }
    }
    return config
}

export async function connectDB(app: Application) {
    const config = handleConfig(app.config.typeorm, app.config.env)
    useContainer(Container)

    const connection = await createConnection(config)
    app.context.connection = connection
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getModelName(file: string) {
    const filename = file.split(sep).pop() || ''
    const name = capitalizeFirstLetter(filename.replace(/\.ts$|\.js$/g, ''))
    return name
}

export function writeTyping(path: string, text: string) {
    writeFileSync(path, formatCode(text), { encoding: 'utf8' })
}

export function getTypingText(
    importText: string,
    repoText: string,
    entityText: string,
) {
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
`
    return tpl
}

export function formatPaths(files: string[]) {
    return files.map(file => {
        const name = getModelName(file)
        file = file.split(sep).join('/')
        const importPath = `../${file}`.replace(/\.ts$|\.js$/g, '')
        return {
            name,
            importPath,
        }
    })
}

export function watchEntity(app: Application) {
    const { baseDir } = app
    const entityDir = join(baseDir, 'app', 'entity')
    const typingsDir = join(baseDir, 'typings')

    if (!existsSync(entityDir)) { return; }

    ensureDirSync(typingsDir)
    watch(entityDir).on('all', (eventType: string) => {
        if (['add', 'change'].includes(eventType)) {
            createTyingFile(app)
        }

        if (['unlink'].includes(eventType)) {
            createTyingFile(app)
        }
    })
}

export function createTyingFile(app: Application) {
    const { baseDir } = app
    const entityDir = join(baseDir, 'app', 'entity')
    const files = find(entityDir, { matching: '*.ts' })
    const typingPath = join(baseDir, 'typings', 'typeorm.d.ts')
    const pathArr = formatPaths(files)
    const importText = pathArr
        .map(i => `import { ${i.name} } from '${i.importPath}'`)
        .join('\n')
    // const repoText = pathArr
    //     .map(i => `${i.name}: Repository<${i.name}>`)
    //     .join('\n')
    const repoText = pathArr
        .map(i => `${i.name}: ${i.name}`)
        .join('\n')

    // TODO
    const entityText = pathArr.map(i => `${i.name}: any`).join('\n')
    const text = getTypingText(importText, repoText, entityText)
    writeTyping(typingPath, text)
}

export function getEntityFromPath(app: Application, entityPath: string) {
    const connection: Connection = app.context.connection
    const fileModule = require(entityPath)
    const entities = Object.keys(fileModule).reduce(
        (result, cur) => {
            try {
                // TODO: 太 hack
                connection.getMetadata(fileModule[cur])
                if (!result.includes(fileModule[cur])) {
                    return [...result, fileModule[cur]]
                } else {
                    return result
                }
            } catch {
                //
            }

            return result
        },
        [] as any[],
    )

    if (!entities.length) {
        throw new Error(`${entityPath} 格式不正确，不存在 @entity`)
    }

    return entities[0]
}

export async function loadEntityAndModel(app: Application) {
    const { baseDir } = app
    const entityDir = join(baseDir, 'app', 'entity')

    if (!existsSync(entityDir)) return

    const matching = hasTsLoader ? '*.ts' : '*.js'

    const files = find(entityDir, { matching })
    app.context.repo = {}
    app.context.entity = {}

    try {
        for (const file of files) {
            const entityPath = join(baseDir, file)
            const entity: any = getEntityFromPath(app, entityPath)
            const name = getModelName(file)
            const repo = getRepository(entity)
            app.context.repo[name] = new Proxy(repo, {
                get(target: any, key: string) {
                    if (target[key]) { return target[key]; }
                    return entity.prototype[key].bind(target);
                },
                set(target: any, key: string, value: any) {
                    target[key] = value;
                    return true;
                }
            });
            app.context.entity[name] = entity
        }
    } catch (e) {
        app.logger.error(e)
    }
}
