import { PROTO } from '../../constants';
import { BitcoinNetworkInfo } from '../../types';
export declare function mapOutputScriptToKey(script_type: string): "p2tr" | "p2wpkh" | "p2sh" | "p2pkh" | undefined;
export declare const getTransactionVbytes: (inputs: PROTO.TxInputType[], outputs: PROTO.TxOutputType[], coinInfo: BitcoinNetworkInfo) => number | undefined;
//# sourceMappingURL=transactionBytes.d.ts.map