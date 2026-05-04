import EventEmitter from 'events';
import { CallMethod } from './events';
export declare const eventEmitter: EventEmitter<[never]>;
declare const TrezorConnect: Omit<import("./types").TrezorConnect, "init"> & {
    init: import("./types/api/init").InitType<Record<string, any>>;
    call: CallMethod;
};
export default TrezorConnect;
export * from './exports';
//# sourceMappingURL=index.d.ts.map