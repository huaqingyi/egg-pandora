import { Application } from 'egg';
export declare class Document {
    private app;
    constructor(app: Application);
    buildDocument(app: Application): {};
    generateCommentBlocks(filePath: string): string[];
    getComment(commentBlock: any, regex: any): false | any[];
    hasController(block: any): boolean;
    generateAPIFunc(filepath: string): any[];
    isIgnore(block: string): boolean;
    generateSummary(block: string): string;
    generateRequest(block: string, swagger: any): any[];
    formatRequest(request: string[][]): any[];
    generateResponse(block: string, swagger: any): any[];
    generateDescription(block: string): any;
    generateConsumes(block: string, swagger: any): any[];
    generateProduces(block: string, swagger: any): any[];
    generateSecurity(block: any, securitys: any, swagger: any): any[];
    isDeprecated(block: string): boolean;
    parse(fileDir: any, securitys: any, swagger: any): {
        tags: any[];
        paths: any;
    };
}
