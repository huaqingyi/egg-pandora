import { Context, Controller } from 'egg';
import { RequestMethod } from './controller';
import { ValidationSchema } from 'class-validator/types/validation-schema/ValidationSchema';
export interface PandoraLogicRule {
    boolean?: true;
    string?: true;
    int?: true;
    float?: true;
    array?: true;
    object?: true;
    required?: true;
    aliasName?: string;
    method?: RequestMethod | RequestMethod[];
    jsonSchema?: ValidationSchema | Function;
    requiredIf?: string[];
    requiredNotIf?: string[];
    requiredWith?: string[];
    requiredWithAll?: string[];
    requiredWithOut?: string[];
    requiredWithOutAll?: string[];
    contains?: string;
    equals?: string;
    different?: string;
    before?: string;
    after?: string;
    alpha?: string;
    alphaDash?: string;
    alphaNumeric?: string;
    alphaNumericDash?: string;
    ascii?: true;
    base64?: true;
    byteLength?: {
        min?: number;
        max?: number;
    } | number;
    creditCard?: true;
    currency?: true | any;
    date?: true;
    decimal?: true;
    divisibleBy?: number;
    email?: true;
    fqdn?: true | any;
    fullWidth?: true;
    halfWidth?: true;
    hexColor?: true;
    hex?: true;
    ip?: true;
    ip4?: true;
    ip6?: true;
    isbn?: true;
    isin?: true;
    iso8601?: true;
    issn?: true;
    uuid?: true;
    dataURI?: true;
    md5?: true;
    macAddress?: true;
    variableWidth?: true;
    in?: string[];
    notIn?: string;
    length?: {
        min?: number;
        max?: number;
    } | number;
    lowercase?: true;
    uppercase?: true;
    mobile?: true | any;
    mongoId?: true;
    multibyte?: true;
    url?: true;
    order?: true;
    field?: true;
    image?: true;
    startWith?: string;
    endWith?: string;
    regexp?: RegExp;
    children?: PandoraLogicRule;
    [x: string]: any;
}
export interface PandoraLogicRules {
    [x: string]: PandoraLogicRule;
}
export interface PandoraLogicRuleMsg {
    [x: string]: any;
}
export declare class Logic extends Controller {
    protected validator: any;
    constructor(ctx: Context);
    private _rulesParse;
    validate(rules: PandoraLogicRules, msgs?: PandoraLogicRuleMsg): any;
    validation(rules: PandoraLogicRules, msgs?: PandoraLogicRuleMsg): true | Promise<never>;
}
export declare const PandoraForm: {
    param(this: Context, name?: string | undefined): string | import("egg").PlainObject<string>;
    post(this: Context, name?: string | undefined): any;
    file(this: Context, name?: string | undefined): import("egg-multipart").EggFile | import("egg-multipart").EggFile[] | undefined;
};
