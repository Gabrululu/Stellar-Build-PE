import { ValidationError } from 'is-my-json-valid';
export declare class UnsupportedSerializationError extends Error {
    constructor(methodName: string, serializationType: string);
}
export declare class UnknownArgumentError extends Error {
    constructor(actualArgName: string, expectedArgNames: string[]);
}
export declare class ArgumentSchemaError extends Error {
    constructor(argName: string, errors: ValidationError[]);
}
export declare class ConflictingOptions extends Error {
    constructor();
}
//# sourceMappingURL=errors.d.ts.map