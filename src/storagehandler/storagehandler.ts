export abstract class StorageHandler {
    public abstract get(name: string): Promise<string | null>

    public abstract set(
        name: string,
        value: string,
        timeToLive: number | null
    ): Promise<string | null>

    public abstract delete(name: string): Promise<boolean>
}
