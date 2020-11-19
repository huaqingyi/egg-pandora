import { ValidationError } from 'class-validator';
export declare const AOP: {
    schema<T = any>(someClass?: T | undefined): any;
    vaildAOP<T_1>(someClass: new (...args: any[]) => T_1, data: any): Promise<ValidationError[]>;
};
