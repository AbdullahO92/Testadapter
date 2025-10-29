import { StorageHandler } from '../storagehandler/storagehandler'

export abstract class EntityHandler {
    constructor(private readonly storageHandler: StorageHandler) {}

    protected async getEntity(key: string): Promise<string | null> {
        const entity = await this.get(key)
        if (!entity) return null
        return entity[0]
    }

    protected async getEntities(key: string): Promise<string[] | null> {
        return await this.get(key)
    }

    protected async addEntity(key: string, value: string): Promise<boolean> {
        var entities = await this.get(key)
        if (entities) {
            if (entities.includes(value)) return true
            entities.push(value)
        } else entities = [value]

        const result = await this.set(key, entities)
        return result != null
    }

    protected async addEntities(
        key: string,
        values: string[]
    ): Promise<boolean> {
        var entities = await this.get(key)
        if (!entities) {
            entities = values
        } else {
            for (const value of values) {
                if (entities.includes(value)) continue
                entities.push(value)
            }
        }

        const result = await this.set(key, entities)
        return result != null
    }

    protected async updateEntity(key: string, value: string): Promise<boolean> {
        const result = await this.set(key, [value])
        return result != null
    }

    protected async removeEntity(key: string, value: string): Promise<boolean> {
        var entities = await this.get(key)
        if (!entities) return true
        else if (!entities.includes(value)) return true

        entities = entities.filter((entity) => entity != value)
        const result = await this.set(key, entities)
        return result != null
    }

    protected async removeEntities(
        key: string,
        values: string[]
    ): Promise<boolean> {
        var entities = await this.get(key)
        if (!entities) {
            return true
        } else {
            entities = entities.filter((entity) => !values.includes(entity))
        }

        const result = await this.set(key, entities)
        return result != null
    }

    protected async get(key: string): Promise<string[] | null> {
        const result = await this.storageHandler.get(this.getEntryName(key))
        if (!result) return null
        return JSON.parse(result)
    }

    private async set(key: string, values: string[]): Promise<string[] | null> {
        const result = await this.storageHandler.set(
            this.getEntryName(key),
            JSON.stringify(values),
            null
        )
        if (!result) return null
        return values
    }

    protected async deleteEntities(key: string): Promise<boolean> {
        return await this.storageHandler.delete(this.getEntryName(key))
    }

    protected abstract getEntryName(key: string): string
}
