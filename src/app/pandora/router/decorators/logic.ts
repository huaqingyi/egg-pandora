import { Context, Controller } from 'egg';
import Validator from 'think-validator';
import { RequestMethod } from './controller';
import { ValidationSchema } from 'class-validator/types/validation-schema/ValidationSchema';
import { find, isEmpty, map } from 'lodash';

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
    byteLength?: { min?: number; max?: number; } | number;
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
    length?: { min?: number; max?: number; } | number;
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

export class Logic extends Controller {

    protected validator: any;

    constructor(ctx: Context) {
        super(ctx);
        this.validator = new Validator(ctx);
    }

    private _rulesParse(rules: PandoraLogicRule) {
        const nrules: any = {};
        map(rules, (r, n) => {
            nrules[n] = r;
            if (r.method) { nrules[n].method = r.method.join(','); }
            return r;
        });
        return nrules;
    }

    public validate(rules: PandoraLogicRules, msgs?: PandoraLogicRuleMsg) {
        const ret = this.validator.validate(this._rulesParse(rules), msgs);
        if (isEmpty(ret)) {
            return true;
        } else { return ret; }
    }

    public validation(rules: PandoraLogicRules, msgs?: PandoraLogicRuleMsg) {
        const ret = this.validator.validate(this._rulesParse(rules), msgs);
        if (isEmpty(ret)) {
            return true;
        } else { return Promise.reject(ret); }
    }
}

export const PandoraForm = {
    param(this: Context, name?: string) {
        if (name) {
            return this.request.query[name];
        }
        return this.request.query;
    },
    post(this: Context, name?: string) {
        if (name) {
            return this.request.body[name];
        }
        return this.request.body;
    },
    file(this: Context, name?: string) {
        if (name) {
            return find(this.request.files, ({ filename }) => filename === name);
        }
        return this.request.files;
    },
};
