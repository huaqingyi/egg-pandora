declare const _default: {
    /**
     * swagger version 2.0
     */
    SWAGGERVERSION: string;
    /**
     * request 中 {type} 支持的基础类型 string,number,boolean,integer,array,file
     */
    type: string[];
    /**
     * contract 中内部itemType不需特殊处理的类型 string,number,boolean,integer,array
     */
    itemType: string[];
    /**
     * regex for controller
     */
    CONTROLLER: RegExp;
    /**
     * regex for router
     */
    ROUTER: RegExp;
    /**
     * regex for summary
     */
    SUMMARY: RegExp;
    /**
     * regex for description
     */
    DESCRIPTION: RegExp;
    /**
     * regex for request
     */
    REQUEST: RegExp;
    /**
     * regex for response
     */
    RESPONSE: RegExp;
    /**
     * regex for CONSUME
     */
    CONSUME: RegExp;
    /**
     * regex for PRODUCE
     */
    PRODUCE: RegExp;
};
export default _default;
