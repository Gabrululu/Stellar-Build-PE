import { Log } from '../../utils/debug';
import type { Device } from '../Device';
type Context = {
    device: Device;
    logger: Log;
};
export declare const checkFirmwareHashWithRetries: (context: Context) => Promise<void>;
export {};
//# sourceMappingURL=checkFirmwareHashWithRetries.d.ts.map