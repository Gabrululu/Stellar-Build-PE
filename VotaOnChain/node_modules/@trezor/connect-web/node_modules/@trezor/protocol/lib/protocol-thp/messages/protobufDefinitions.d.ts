export declare const getProtobufDefinitions: () => {
    ThpPairingMethod: {
        values: {
            SkipPairing: number;
            CodeEntry: number;
            QrCode: number;
            NFC: number;
        };
    };
    ThpDeviceProperties: {
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
                options: {
                    packed: boolean;
                };
            };
        };
    };
    ThpHandshakeCompletionReqNoisePayload: {
        fields: {
            host_pairing_credential: {
                type: string;
                id: number;
            };
        };
    };
    ThpCreateNewSession: {
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
        fields: {};
    };
    ThpSelectMethod: {
        fields: {
            selected_pairing_method: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpPairingPreparationsFinished: {
        fields: {};
    };
    ThpCodeEntryCommitment: {
        fields: {
            commitment: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryChallenge: {
        fields: {
            challenge: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryCpaceTrezor: {
        fields: {
            cpace_trezor_public_key: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCodeEntryCpaceHostTag: {
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
        fields: {
            secret: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpQrCodeTag: {
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpQrCodeSecret: {
        fields: {
            secret: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpNfcTagHost: {
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpNfcTagTrezor: {
        fields: {
            tag: {
                rule: string;
                type: string;
                id: number;
            };
        };
    };
    ThpCredentialRequest: {
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
        fields: {};
    };
    ThpEndResponse: {
        fields: {};
    };
    MessageType: {
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