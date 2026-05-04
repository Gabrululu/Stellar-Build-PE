import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class GetFirmwareHash extends AbstractMethod<'getFirmwareHash', PROTO.GetFirmwareHash> {
    init(): void;
    run(): Promise<{
        hash: string;
    }>;
}
//# sourceMappingURL=getFirmwareHash.d.ts.map