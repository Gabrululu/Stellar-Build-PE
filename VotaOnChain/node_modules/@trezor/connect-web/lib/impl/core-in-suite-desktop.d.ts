import EventEmitter from 'events';
import { CallMethodAnyResponse, CallMethodPayload, UiResponseEvent } from '@trezor/connect/lib/events';
import { ConnectFactoryDependencies } from '@trezor/connect/lib/factory';
import type { ConnectSettings, ConnectSettingsPublic, ConnectSettingsWeb, Manifest } from '@trezor/connect/lib/types';
export declare class CoreInSuiteDesktop implements ConnectFactoryDependencies<ConnectSettingsWeb> {
    eventEmitter: EventEmitter<[never]>;
    protected _settings: ConnectSettings;
    private ws;
    private localNetworkPermissionState;
    constructor();
    manifest(data: Manifest): void;
    dispose(): Promise<undefined>;
    cancel(_error?: string): void;
    private handshake;
    init(settings: Partial<ConnectSettingsPublic>): Promise<void>;
    private error;
    private connect;
    setTransports(): void;
    call(params: CallMethodPayload): Promise<CallMethodAnyResponse>;
    uiResponse(_response: UiResponseEvent): void;
    disableWebUSB(): void;
    requestWebUSBDevice(): void;
    renderWebUSBButton(): void;
}
export declare const TrezorConnect: Omit<import("@trezor/connect/lib/types").TrezorConnect, "init"> & {
    init: import("@trezor/connect/lib/types/api/init").InitType<Record<string, any>>;
    call: import("@trezor/connect/lib/events").CallMethod;
} & Record<string, any>;
//# sourceMappingURL=core-in-suite-desktop.d.ts.map