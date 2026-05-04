import { type VNode, Component } from 'preact';
import { type Signal } from '@preact/signals';
type HwAccountsFetcherPageType = {
    error: string | null;
    loading: boolean;
    accounts: Array<{
        index: number;
        publicKey: string;
    }>;
};
export declare class HwAccountsFetcherPage extends Component {
    stateSignal: Signal<HwAccountsFetcherPageType>;
    componentWillMount(): void;
    fetchAccounts(): Promise<void>;
    selectAccount(params: {
        publicKey: string;
        index: number;
    }): Promise<void>;
    render(): VNode;
}
export {};
//# sourceMappingURL=hw-accounts-fetcher.page.d.ts.map