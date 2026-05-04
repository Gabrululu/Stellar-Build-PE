import { VerifyAuthenticityProofResult } from '@trezor/device-authenticity';
import { AbstractMethod } from '../core/AbstractMethod';
import { AuthenticateDeviceParams } from '../types/api/authenticateDevice';
export default class AuthenticateDevice extends AbstractMethod<'authenticateDevice', AuthenticateDeviceParams> {
    init(): void;
    run(): Promise<{
        optigaResult: VerifyAuthenticityProofResult;
        tropicResult: VerifyAuthenticityProofResult | null;
    }>;
}
//# sourceMappingURL=authenticateDevice.d.ts.map