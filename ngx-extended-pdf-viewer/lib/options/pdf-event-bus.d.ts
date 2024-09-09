export interface IEventBus {
    destroy(): void;
    on(eventName: string, listener: (event: any) => void): any;
    off(eventName: string, listener: (event: any) => void): any;
    dispatch(eventName: string, options?: any): void;
}
