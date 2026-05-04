type Request = {
    id: number;
    payload: {
        url: string;
    };
};
type Response = {
    id: number;
    payload: {
        success: boolean;
    };
};
declare const _default: () => {
    postMessage: (_: Request) => void;
    onmessage: (_: {
        data: Response;
    }) => void;
    onerror: (_: Error) => void;
    terminate: () => void;
};
export default _default;
//# sourceMappingURL=pingWorker.d.ts.map