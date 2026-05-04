import { thp as protocolThp } from '@trezor/protocol';
import type { Device } from '../Device';
type ThpTypedCall = {
    ThpCreateChannelRequest: 'ThpCreateChannelResponse';
    ThpHandshakeInitRequest: 'ThpHandshakeInitResponse';
    ThpHandshakeCompletionRequest: 'ThpHandshakeCompletionResponse';
    ThpPairingRequest: 'ThpPairingRequestApproved';
    ThpSelectMethod: [
        'ThpCodeEntryCommitment',
        'ThpEndResponse',
        'ThpPairingRequestApproved',
        'ThpPairingPreparationsFinished'
    ];
    ThpCodeEntryChallenge: ['ThpCodeEntryCpaceTrezor'];
    ThpCodeEntryCpaceHostTag: 'ThpCodeEntrySecret';
    ThpQrCodeTag: 'ThpQrCodeSecret';
    ThpNfcTagHost: 'ThpNfcTagTrezor';
    ThpCredentialRequest: 'ThpCredentialResponse';
    ThpEndRequest: 'ThpEndResponse';
    ThpCreateNewSession: 'Success';
};
type ThpMessage = protocolThp.ThpMessageType & {
    Success: {};
};
type TypedPayloadItem<K> = K extends keyof ThpMessage ? {
    type: K;
    message: ThpMessage[K];
} : never;
type ExtractFromArray<A extends any[]> = {
    [K in keyof A]: TypedPayloadItem<A[K]>;
}[number];
type MessageKey = keyof ThpTypedCall;
type TypedPayload<T extends MessageKey> = ThpTypedCall[T] extends any[] ? ExtractFromArray<ThpTypedCall[T]> : TypedPayloadItem<ThpTypedCall[T]>;
type ThpCallResponse = {
    [K in keyof ThpTypedCall]: TypedPayload<K>;
};
type ThpMessagePayload<T extends MessageKey = MessageKey> = ThpMessage[T];
export declare const thpCall: <T extends MessageKey>(device: Device, name: T, data: ThpMessagePayload<T>) => Promise<ThpCallResponse[T]>;
export declare const abortThpWorkflow: (device: Device) => Promise<void>;
export {};
//# sourceMappingURL=thpCall.d.ts.map