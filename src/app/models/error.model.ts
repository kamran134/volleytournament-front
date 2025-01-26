export interface Error {
    headers: any;
    status: number;
    statusText: string;
    url: string;
    message: string;
    error: {
        message: string;
    },
    ok: boolean;
    name: string;
}