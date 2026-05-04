import EventEmitter from 'events';
import { CallMethodAnyResponse, CallMethodPayload, UiResponseEvent } from '@trezor/connect/lib/events';
import { ConnectFactoryDependencies } from '@trezor/connect/lib/factory';
import type { ConnectSettings, ConnectSettingsWeb, Manifest } from '@trezor/connect/lib/types';
import { InitFullSettings } from '@trezor/connect/lib/types/api/init';
import { Log } from '@trezor/connect/lib/utils/debug';
export declare class CoreInSuiteWeb implements ConnectFactoryDependencies<ConnectSettingsWeb> {
    eventEmitter: EventEmitter<[never]>;
    protected _settings: ConnectSettings;
    private _popupManager?;
    protected logger: Log;
    constructor();
    manifest(data: Manifest): void;
    dispose(): Promise<undefined>;
    init(settings: InitFullSettings<{}>): Promise<void>;
    private getSuiteUrl;
    call(params: CallMethodPayload): Promise<CallMethodAnyResponse>;
    cancel(_error?: string): void;
    setTransports(): void;
    uiResponse(_response: UiResponseEvent): void;
    disableWebUSB(): void;
    requestWebUSBDevice(): void;
    renderWebUSBButton(): void;
}
export declare const TrezorConnect: Omit<import("@trezor/connect/lib/types").TrezorConnect, "init"> & {
    init: import("@trezor/connect/lib/types/api/init").InitType<{}>;
    call: import("@trezor/connect/lib/events").CallMethod;
} & Record<string, any>;
//# sourceMappingURL=core-in-suite-web.d.ts.map