import { LRUMap } from 'lru_map';
export class Storage {
    cache;
    static MAX_ELEMENTS = 100;
    // map block hash to block height
    blockHeights;
    constructor(options = { max: Storage.MAX_ELEMENTS }) {
        this.cache = new LRUMap(options.max);
        this.blockHeights = new Map();
    }
    load(blockRef) {
        const noBlockId = !('blockId' in blockRef);
        if (noBlockId)
            return undefined;
        let blockId = blockRef.blockId;
        // block hash is passed, so get its corresponding block height
        if (blockId.toString().length == 44) {
            blockId = this.blockHeights.get(blockId.toString());
        }
        // get cached values for the given block height
        return this.cache.get(blockId);
    }
    save(blockHash, { blockHeight, blockTimestamp, contractCode, contractState }) {
        this.blockHeights.set(blockHash, blockHeight);
        this.cache.set(blockHeight, { blockHeight, blockTimestamp, contractCode, contractState });
    }
}
