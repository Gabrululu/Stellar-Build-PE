import { AbstractMessageChannel, AbstractMessageChannelConstructorParams } from './abstract';
export declare class WindowServiceWorkerChannel<IncomingMessages extends {
    type: string;
}> extends AbstractMessageChannel<IncomingMessages> {
    private port;
    constructor({ name, channel, }: Pick<AbstractMessageChannelConstructorParams, 'channel'> & {
        name: string;
    });
    connect(): void;
    disconnect(): void;
}
//# sourceMappingURL=window-serviceworker.d.ts.map