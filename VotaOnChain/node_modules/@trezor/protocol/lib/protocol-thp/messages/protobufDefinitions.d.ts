export declare const getProtobufDefinitions: () => {
    ThpPairingMethod: {
        edition: string;
        values: {
            SkipPairing: number;
            CodeEntry: number;
            QrCode: number;
            NFC: number;
        };
    };
    ThpDeviceProperties: {
        edition: string;
        fields: {
            internal_model: {
                rule: string;
                type: string;
                id: number;
            };
            model_variant: {
                type: string;
                id: number;
                options: {
                    default: number;
                };
            };
            protocol_version_major: {
                rule: string;
                type: string;
                id: number;
            };
            protocol_version_minor: {
                rule: string;
                type: string;
                id: number;
            };
            pairing_methods: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpHandshakeCompletionReqNoisePayload: {
        edition: string;
        fields: {
            host_pairing_credential: {
                type: string;
                id: number;
            };
        };
    };
    ThpCreateNewSession: {
        edition: string;
        fields: {
            passphrase: {
                type: string;
                id: number;
            };
            on_device: {
                type: string;
                id: number;
                options: {
                    default: boolean;
                };
            };
            derive_cardano: {
                type: string;
                id: number;
                options: {
                    default: boolean;
                };
            };
        };
    };
    ThpPairingRequest: {
        edition: string;
        fields: {
            host_name: {
                rule: string;
                type: string;
                id: number;
            };
            app_name: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpPairingRequestApproved: {
        edition: string;
        fields: {};
    };
    ThpSelectMethod: {
        edition: string;
        fields: {
            selected_pairing_method: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpPairingPreparationsFinished: {
        edition: string;
        fields: {};
    };
    ThpCodeEntryCommitment: {
        edition: string;
        fields: {
            commitment: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryChallenge: {
        edition: string;
        fields: {
            challenge: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryCpaceTrezor: {
        edition: string;
        fields: {
            cpace_trezor_public_key: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryCpaceHostTag: {
        edition: string;
        fields: {
            cpace_host_public_key: {
                rule: string;
                type: string;
                id: number;
            };
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntrySecret: {
        edition: string;
        fields: {
            secret: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpQrCodeTag: {
        edition: string;
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpQrCodeSecret: {
        edition: string;
        fields: {
            secret: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpNfcTagHost: {
        edition: string;
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpNfcTagTrezor: {
        edition: string;
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCredentialRequest: {
        edition: string;
        fields: {
            host_static_public_key: {
                rule: string;
                type: string;
                id: number;
            };
            autoconnect: {
                type: string;
                id: number;
                options: {
                    default: boolean;
                };
            };
            credential: {
                type: string;
                id: number;
            };
        };
    };
    ThpCredentialResponse: {
        edition: string;
        fields: {
            trezor_static_public_key: {
                rule: string;
                type: string;
                id: number;
            };
            credential: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpEndRequest: {
        edition: string;
        fields: {};
    };
    ThpEndResponse: {
        edition: string;
        fields: {};
    };
    MessageType: {
        edition: string;
        options: {
            '(has_bitcoin_only_values)': boolean;
            '(wire_enum)': boolean;
        };
        values: {
            ThpCreateNewSession: number;
            ThpCredentialRequest: number;
            ThpCredentialResponse: number;
            ThpPairingRequest: number;
            ThpPairingRequestApproved: number;
            ThpSelectMethod: number;
            ThpPairingPreparationsFinished: number;
            ThpEndRequest: number;
            ThpEndResponse: number;
            ThpCodeEntryCommitment: number;
            ThpCodeEntryChallenge: number;
            ThpCodeEntryCpaceTrezor: number;
            ThpCodeEntryCpaceHostTag: number;
            ThpCodeEntrySecret: number;
            ThpQrCodeTag: number;
            ThpQrCodeSecret: number;
            ThpNfcTagHost: number;
            ThpNfcTagTrezor: number;
        };
    };
};
//# sourceMappingURL=protobufDefinitions.d.ts.map