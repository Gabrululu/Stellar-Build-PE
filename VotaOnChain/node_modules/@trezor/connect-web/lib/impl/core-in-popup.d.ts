import EventEmitter from 'events';
import { CallMethodAnyResponse, CallMethodPayload, UiResponseEvent } from '@trezor/connect/lib/events';
import { ConnectFactoryDependencies } from '@trezor/connect/lib/factory';
import type { ConnectSettings, ConnectSettingsWeb, Manifest } from '@trezor/connect/lib/types';
import { InitFullSettings } from '@trezor/connect/lib/types/api/init';
import { Log } from '@trezor/connect/lib/utils/debug';
export declare class CoreInPopup implements ConnectFactoryDependencies<ConnectSettingsWeb> {
    eventEmitter: EventEmitter<[never]>;
    protected _settings: ConnectSettings;
    protected logger: Log;
    protected popupManagerLogger: Log;
    private _popupManager?;
    constructor();
    private logWriterFactory;
    manifest(data: Manifest): void;
    dispose(): Promise<undefined>;
    cancel(error?: string): void;
    init(settings: InitFullSettings<{}>): Promise<void>;
    setTransports(): void;
    call(params: CallMethodPayload): Promise<CallMethodAnyResponse>;
    private callInit;
    uiResponse(response: UiResponseEvent): void;
    renderWebUSBButton(): void;
    disableWebUSB(): void;
    requestWebUSBDevice(): void;
}
export declare const TrezorConnect: Omit<import("@trezor/connect/lib/types").TrezorConnect, "init"> & {
    init: import("@trezor/connect/lib/types/api/init").InitType<{}>;
    call: import("@trezor/connect/lib/events").CallMethod;
} & Record<string, any>;
//# sourceMappingURL=core-in-popup.d.ts.map