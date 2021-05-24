declare const _default: {
    repo<E extends new (...props: any) => import("../pandora").TypeOrm<E>>(...props: any[]): any;
    param(this: import("egg").Context, name?: string | undefined): string | import("egg").PlainObject<string>;
    post(this: import("egg").Context, name?: string | undefined): any;
    file(this: import("egg").Context, name?: string | undefined): import("egg-multipart").EggFile | import("egg-multipart").EggFile[] | undefined;
    schema<T = any>(someClass?: T | undefined): any;
    vaildAOP<T_1>(someClass: new (...args: any[]) => T_1, data: any): Promise<import("class-validator/types/validation/ValidationError").ValidationError[]>;
};
export default _default;
