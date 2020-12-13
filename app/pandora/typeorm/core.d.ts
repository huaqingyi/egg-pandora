import { Application } from 'egg';
export declare function formatCode(text: string): string;
export declare function handleConfig(config: any, _env: string): any;
export declare function connectDB(app: Application): Promise<void>;
export declare function capitalizeFirstLetter(str: string): string;
export declare function getModelName(file: string): string;
export declare function writeTyping(path: string, text: string): void;
export declare function getTypingText(importText: string, repoText: string, entityText: string): string;
export declare function formatPaths(files: string[]): {
    name: string;
    importPath: string;
}[];
export declare function watchEntity(app: Application): void;
export declare function createTyingFile(app: Application): void;
export declare function getEntityFromPath(app: Application, entityPath: string): any;
export declare function loadEntityAndModel(app: Application): Promise<void>;
