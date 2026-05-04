export class UnsupportedSerializationError extends Error {
    constructor(methodName, serializationType) {
        super(`Contract method '${methodName}' is using an unsupported serialization type ${serializationType}`);
    }
}
export class UnknownArgumentError extends Error {
    constructor(actualArgName, expectedArgNames) {
        super(`Unrecognized argument '${actualArgName}', expected '${JSON.stringify(expectedArgNames)}'`);
    }
}
export class ArgumentSchemaError extends Error {
    constructor(argName, errors) {
        super(`Argument '${argName}' does not conform to the specified ABI schema: '${JSON.stringify(errors)}'`);
    }
}
export class ConflictingOptions extends Error {
    constructor() {
        super('Conflicting contract method options have been passed. You can either specify ABI or a list of view/call methods.');
    }
}
