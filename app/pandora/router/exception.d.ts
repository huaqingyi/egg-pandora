import { Dto } from '../aopImpl/dto';
import { Controller } from 'egg';
export declare type PDto<D extends Dto> = (new (...args: any[]) => D) & typeof Dto;
export declare class ExceptionThrown {
    static _dto: PDto<any>;
    static _config: ExceptionThrownConfig;
    static mount<D extends Dto>(dto: PDto<D>, config: ExceptionThrownConfig): typeof ExceptionThrown;
    static exceper(action: Function): (this: Controller, ...props: any[]) => Promise<void>;
}
export interface ExceptionThrownConfig {
    success: string;
    errmsg: string;
    error: string;
}
export declare function mount<D extends Dto>(dto: PDto<D>, config: ExceptionThrownConfig): typeof ExceptionThrown;
export declare function Exception(code?: number): (target: any, prototypeKey: string, descr: TypedPropertyDescriptor<any>) => void;
export declare function Exception(target: any, prototypeKey: string, descr: TypedPropertyDescriptor<any>): void;
