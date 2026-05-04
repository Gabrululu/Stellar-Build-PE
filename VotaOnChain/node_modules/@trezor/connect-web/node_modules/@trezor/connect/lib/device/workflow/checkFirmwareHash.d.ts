import { FirmwareHashCheckResult } from '../../types';
import { Log } from '../../utils/debug';
import type { Device } from '../Device';
type Context = {
    device: Device;
    logger: Log;
};
export declare const checkFirmwareHash: ({ device, logger, }: Context) => Promise<FirmwareHashCheckResult | null>;
export {};
//# sourceMappingURL=checkFirmwareHash.d.ts.map