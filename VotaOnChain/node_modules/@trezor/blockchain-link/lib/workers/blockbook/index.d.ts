import type * as MessageTypes from '@trezor/blockchain-link-types/lib/messages';
import { BaseWorker } from '../baseWorker';
import { BlockbookAPI } from './websocket';
declare class BlockbookWorker extends BaseWorker<BlockbookAPI> {
    cleanup(): void;
    protected isConnected(api: BlockbookAPI | undefined): api is BlockbookAPI;
    tryConnect(url: string): Promise<BlockbookAPI>;
    disconnect(): void;
    messageHandler(event: {
        data: MessageTypes.Message;
    }): Promise<true | undefined>;
}
export default function Blockbook(): BlockbookWorker;
export {};
//# sourceMappingURL=index.d.ts.map