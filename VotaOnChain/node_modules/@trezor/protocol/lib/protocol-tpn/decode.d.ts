export declare enum Version {
    v1 = 1
}
export declare enum TrezorPushNotificationType {
    BOOT = 0,
    UNLOCK = 1,
    LOCK = 2,
    DISCONNECT = 3,
    SETTING_CHANGE = 4,
    SOFTLOCK = 5,
    SOFTUNLOCK = 6,
    PIN_CHANGE = 7,
    WIPE = 8,
    UNPAIR = 9,
    NOTIFY_POWER_STATUS_CHANGE = 10
}
export declare enum TrezorPushNotificationMode {
    NormalMode = 0,
    BootloaderMode = 1
}
export interface DecodedTrezorPushNotification {
    type: TrezorPushNotificationType;
    mode: TrezorPushNotificationMode;
}
export declare const decode: (message: number[]) => {
    readonly success: false;
    readonly error: "Protocol missmatch version";
    readonly payload?: undefined;
} | {
    readonly success: false;
    readonly error: "Malformed protocol format";
    readonly payload?: undefined;
} | {
    readonly success: true;
    readonly payload: {
        readonly type: number;
        readonly mode: number;
    };
    readonly error?: undefined;
};
//# sourceMappingURL=decode.d.ts.map