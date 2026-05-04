"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectAllowedMethods = exports.WalletConnectTargetChain = exports.WalletConnectModule = exports.WALLET_CONNECT_ID = void 0;
const sign_client_1 = require("@walletconnect/sign-client");
const core_1 = require("@reown/appkit/core");
const networks_1 = require("@reown/appkit/networks");
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
const values_js_1 = require("../../state/values.js");
exports.WALLET_CONNECT_ID = "wallet_connect";
class WalletConnectModule {
    constructor(wcParams) {
        Object.defineProperty(this, "wcParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: wcParams
        });
        Object.defineProperty(this, "moduleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mod_js_1.ModuleType.BRIDGE_WALLET
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/walletconnect.png"
        });
        Object.defineProperty(this, "productId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.WALLET_CONNECT_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "WalletConnect"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://walletconnect.com/"
        });
        Object.defineProperty(this, "modal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initiated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        if (!wcParams)
            throw new Error("The WalletConnect modules have required params.");
        sign_client_1.SignClient.init({
            projectId: wcParams.projectId,
            metadata: wcParams.metadata,
            ...(wcParams.signClientOptions || {}),
        }).then((client) => {
            client.on("display_uri", (uri) => {
                this.modal.open({ uri });
            });
            client.on("session_delete", (ev) => {
                this.closeSession(ev.topic);
            });
            /**
             * The next events are not currently supported but could be included later:
             * session_update
             * session_event
             * session_ping
             * session_expire
             * session_extend
             * proposal_expire
             */
            this.signClient = client;
        });
        this.modal = (0, core_1.createAppKit)({
            projectId: wcParams.projectId,
            manualWCControl: true,
            enableReconnect: true,
            networks: [networks_1.mainnet],
            featuredWalletIds: [
                "aef3112adf415ec870529e96b4d7b434f13961a079d1ee42c9738217d8adeb91", // Freighter
                "76a3d548a08cf402f5c7d021f24fd2881d767084b387a5325df88bc3d4b6f21b", // Lobstr
            ],
            ...(wcParams.appKitOptions || {}),
        });
    }
    async isAvailable() {
        return !!this.signClient && !!this.modal;
    }
    async isPlatformWrapper() {
        const options = [
            {
                provider: "freighter",
                platform: "mobile",
            },
        ];
        return !!options.find(({ provider, platform }) => {
            return window.stellar?.provider === provider && window.stellar?.platform === platform;
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw (0, utils_js_1.parseError)(new Error("WalletConnect modules has not been started yet."));
        }
    }
    async getAddress() {
        await this.runChecks();
        if (values_js_1.selectedNetwork.value !== mod_js_1.Networks.PUBLIC && values_js_1.selectedNetwork.value !== mod_js_1.Networks.TESTNET) {
            throw (0, utils_js_1.parseError)(new Error(`Network ${values_js_1.selectedNetwork.value} is not supported by WalletConnect.`));
        }
        const { uri, approval } = await this.signClient.connect({
            requiredNamespaces: {
                stellar: {
                    methods: [WalletConnectAllowedMethods.SIGN],
                    chains: this.wcParams.allowedChains || [WalletConnectTargetChain.PUBLIC],
                    events: [],
                },
            },
            optionalNamespaces: {
                stellar: {
                    methods: [WalletConnectAllowedMethods.SIGN_AND_SUBMIT],
                    chains: this.wcParams.allowedChains || [WalletConnectTargetChain.PUBLIC],
                    events: [],
                },
            },
        });
        if (uri) {
            this.modal.open({ uri });
        }
        try {
            const session = await approval();
            const accounts = session.namespaces.stellar.accounts.map((account) => account.split(":")[2]);
            values_js_1.wcSessionPaths.value = [
                ...values_js_1.wcSessionPaths.value,
                ...accounts.map((publicKey) => ({ publicKey, topic: session.topic })),
            ];
            this.modal.close();
            return { address: accounts[0] };
        }
        catch (e) {
            this.modal.close();
            throw e;
        }
    }
    async signTransaction(xdr, opts) {
        await this.runChecks();
        const paths = values_js_1.wcSessionPaths.value;
        const targetSession = paths.find((path) => {
            return (opts?.address || values_js_1.activeAddress.value) === path.publicKey;
        });
        if (!targetSession) {
            throw (0, utils_js_1.parseError)(new Error("No WalletConnect session found or it expired for the selected address."));
        }
        const { signedXDR } = await this.signClient.request({
            topic: targetSession.topic,
            chainId: opts?.networkPassphrase === mod_js_1.Networks.PUBLIC
                ? WalletConnectTargetChain.PUBLIC
                : WalletConnectTargetChain.TESTNET,
            request: {
                method: WalletConnectAllowedMethods.SIGN,
                params: { xdr },
            },
        });
        return { signedTxXdr: signedXDR };
    }
    async signAndSubmitTransaction(xdr, opts) {
        await this.runChecks();
        const paths = values_js_1.wcSessionPaths.value;
        const targetSession = paths.find((path) => {
            return (opts?.address || values_js_1.activeAddress.value) === path.publicKey;
        });
        if (!targetSession) {
            throw (0, utils_js_1.parseError)(new Error("No WalletConnect session found or it expired for the selected address."));
        }
        const result = await this.signClient.request({
            topic: targetSession.topic,
            chainId: opts?.networkPassphrase === mod_js_1.Networks.PUBLIC
                ? WalletConnectTargetChain.PUBLIC
                : WalletConnectTargetChain.TESTNET,
            request: {
                method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
                params: { xdr },
            },
        });
        if (result.status !== "success" && result.status !== "pending") {
            throw (0, utils_js_1.parseError)(new Error(`Unexpected status from wallet: ${result.status}`));
        }
        return { status: result.status };
    }
    async disconnect() {
        if (!this.signClient) {
            throw new Error("WalletConnect is not running yet");
        }
        const sessions = await this.getSessions();
        for (const session of sessions) {
            await this.closeSession(session.topic);
        }
    }
    async getSessions() {
        if (!this.signClient) {
            throw new Error("WalletConnect is not running yet");
        }
        return this.signClient.session.values;
    }
    async closeSession(topic, reason) {
        if (!this.signClient) {
            throw new Error("WalletConnect is not running yet");
        }
        values_js_1.wcSessionPaths.value = values_js_1.wcSessionPaths.value.filter((path) => path.topic !== topic);
        if (values_js_1.wcSessionPaths.value.length === 0) {
            // if the sessions path length is now zero, we do a full disconnect.
            // TODO: We need to change this once we support multi account support around the kit
            (0, utils_js_1.disconnect)();
        }
        await this.signClient.disconnect({
            topic,
            reason: {
                message: reason || "Session closed",
                code: -1,
            },
        });
    }
    async signAuthEntry() {
        throw {
            code: -3,
            message: 'WalletConnect does not support the "signAuthEntry" function',
        };
    }
    async signMessage() {
        throw {
            code: -3,
            message: 'WalletConnect does not support the "signMessage" function',
        };
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'WalletConnect does not support the "getNetwork" function',
        };
    }
}
exports.WalletConnectModule = WalletConnectModule;
var WalletConnectTargetChain;
(function (WalletConnectTargetChain) {
    WalletConnectTargetChain["PUBLIC"] = "stellar:pubnet";
    WalletConnectTargetChain["TESTNET"] = "stellar:testnet";
})(WalletConnectTargetChain || (exports.WalletConnectTargetChain = WalletConnectTargetChain = {}));
/**
 * Wallet connect supports both just signing a xdr or signing and sending the transaction to the network.
 * SIGN returns the signed XDR, while SIGN_AND_SUBMIT sends the transaction to the network (useful for multisig).
 */
var WalletConnectAllowedMethods;
(function (WalletConnectAllowedMethods) {
    WalletConnectAllowedMethods["SIGN"] = "stellar_signXDR";
    WalletConnectAllowedMethods["SIGN_AND_SUBMIT"] = "stellar_signAndSubmitXDR";
})(WalletConnectAllowedMethods || (exports.WalletConnectAllowedMethods = WalletConnectAllowedMethods = {}));
