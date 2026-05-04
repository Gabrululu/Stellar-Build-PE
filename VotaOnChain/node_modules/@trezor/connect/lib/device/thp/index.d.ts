import type { Device } from '../Device';
export { abortThpWorkflow } from './thpCall';
export { getThpCredentials } from './pairing';
export { createThpSession } from './session';
export declare const getThpChannel: (device: Device, withInteraction?: boolean) => Promise<"pin-locked" | "thp-locked" | undefined>;
//# sourceMappingURL=index.d.ts.map