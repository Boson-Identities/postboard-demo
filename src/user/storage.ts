export interface Storage {
    [key: string]: any;
    save(callback: (err: any) => void): void;
}
