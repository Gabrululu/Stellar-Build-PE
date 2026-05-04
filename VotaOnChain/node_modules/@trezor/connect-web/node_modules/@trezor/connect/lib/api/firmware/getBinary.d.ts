import { FirmwareRelease } from '@trezor/device-utils';
import { BinaryInfo } from '../../types';
interface GetBinaryParams {
    baseUrl: string;
    path: string;
    release: FirmwareRelease;
}
export declare const getBinary: ({ baseUrl, path, release, }: GetBinaryParams) => Promise<BinaryInfo>;
export declare const getBinaryOptional: (params: GetBinaryParams) => Promise<BinaryInfo | null>;
export {};
//# sourceMappingURL=getBinary.d.ts.map