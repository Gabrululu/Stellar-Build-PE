import { Capability } from '@trezor/protobuf/lib/messages';
import { NETWORK } from '../constants';
import type { Device } from '../device/Device';
import { CallMethodPayload, CallMethodResponse, CoreEventMessage, UI, UiPromiseCreator, UiRequestButtonData, UiRequestConfirmation } from '../events';
import type { PrecomposeResultFinal } from '../types/api/composeTransaction';
import type { DeviceState } from '../types/device';
import type { FirmwareRange } from '../types/firmware';
import type { ConnectSettings } from '../types/settings';
export type Payload<M> = Extract<CallMethodPayload, {
    method: M;
}> & {
    override?: boolean;
};
export type MethodReturnType<M extends CallMethodPayload['method']> = CallMethodResponse<M>;
export type MethodPermission = 'read' | 'write' | 'management' | 'push_tx';
export type DeviceMode = typeof UI.SEEDLESS | typeof UI.BOOTLOADER | typeof UI.INITIALIZE;
export type MethodInfo = {
    useUi: boolean;
    useDevice: boolean;
    useDeviceState: boolean;
    name: string;
    requiredPermissions: MethodPermission[];
    info: string;
    precomposed?: PrecomposeResultFinal;
    confirmation?: UiRequestConfirmation['payload'];
};
export declare const DEFAULT_FIRMWARE_RANGE: FirmwareRange;
export declare abstract class AbstractMethod<Name extends CallMethodPayload['method'], Params = undefined> {
    responseID: number;
    device: Device;
    params: Params;
    deviceState?: DeviceState;
    hasExpectedDeviceState: boolean;
    keepSession: boolean;
    skipFinalReload: boolean;
    skipFirmwareCheck: boolean;
    overridePreviousCall: boolean;
    overridden: boolean;
    name: Name;
    payload: Payload<Name>;
    get info(): string;
    get confirmation(): UiRequestConfirmation['payload'] | undefined;
    useUi: boolean;
    useDevice: boolean;
    useDeviceState: boolean;
    preauthorized?: boolean;
    useEmptyPassphrase: boolean;
    allowSeedlessDevice: boolean;
    firmwareRange: FirmwareRange;
    requiredPermissions: MethodPermission[];
    allowDeviceMode: DeviceMode[];
    requireDeviceMode: DeviceMode[];
    requiredDeviceCapabilities: Capability[];
    network: NETWORK.NetworkType;
    useCardanoDerivation: boolean;
    noBackupConfirmationMode: 'never' | 'always' | 'popup-only';
    getButtonRequestData?(code: string, name?: string): UiRequestButtonData | undefined;
    postMessage: (message: CoreEventMessage) => void;
    createUiPromise: UiPromiseCreator;
    initAsync?(): Promise<void>;
    constructor(message: {
        id?: number;
        payload: Payload<Name>;
    });
    setDevice(device: Device): void;
    private getOriginPermissions;
    checkPermissions({ origin }: Pick<ConnectSettings, 'origin'>): void;
    savePermissions(temporary: boolean | undefined, { origin }: Pick<ConnectSettings, 'origin'>): void;
    checkFirmwareRange(): "ui-device_firmware_old" | "ui-device_firmware_unsupported" | "ui-device_firmware_not_compatible" | "ui-device_firmware_not_installed" | undefined;
    isManagementRestricted({ popup, origin }: Pick<ConnectSettings, 'popup' | 'origin'>): boolean | undefined;
    abstract init(): void;
    getMethodInfo(): MethodInfo;
    payloadToPrecomposed(): Promise<PrecomposeResultFinal | undefined>;
    checkDeviceCapability(): void;
    abstract run(): Promise<MethodReturnType<Name>>;
    dispose(): void;
}
//# sourceMappingURL=AbstractMethod.d.ts.map