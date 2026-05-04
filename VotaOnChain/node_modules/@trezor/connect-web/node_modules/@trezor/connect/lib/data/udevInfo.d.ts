export interface UdevInfo {
    packages: {
        name: string;
        platform: string[];
        url: string;
        signature?: string;
        preferred?: boolean;
    }[];
}
export declare const suggestUdevInstaller: (platform?: string) => UdevInfo;
//# sourceMappingURL=udevInfo.d.ts.map