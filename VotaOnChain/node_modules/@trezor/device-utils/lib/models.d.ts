import { DeviceModelInternal } from './deviceModelInternal';
type ModelColor = string;
type ModelFrontColor = string;
type ModelConfig = {
    name: string;
    colors: Record<ModelColor, string>;
    frontColors?: Record<ModelColor, ModelFrontColor>;
};
export declare const models: Record<DeviceModelInternal, ModelConfig>;
export {};
//# sourceMappingURL=models.d.ts.map