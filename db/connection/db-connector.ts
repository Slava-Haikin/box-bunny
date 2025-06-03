import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export class DatabaseConnector {
    private db: Database | null = null;

    constructor(private path: string) {}

    async checkConnection(): Promise<boolean> {
        try {
            const db = await open({
                filename: this.path,
                driver: sqlite3.Database
            })

            await db.get('SELECT sqlite_version()');
            await db.close();

            console.info('Database connection successful');
            return true;
        } catch (e) {
            console.error('Database connection error: ', e);
            return false;
        }
    }

    private async openConnection(): Promise<Database> {
        if (!this.db) {
            this.db = await open({
                filename: this.path,
                driver: sqlite3.Database
            });
        }

        return this.db;
    }

    async closeConnection(): Promise<void> {
        try {
            if (this.db) {
                await this.db.close();
                this.db = null;
            }
        } catch(e) {
            console.error('Error closing database connection:', e);
        }
    }

    async readData(query: string, params: string[] = []): Promise<string[]> {
        try {
            const db = await this.openConnection();
            const rows = await db.all(query, ...params);

            return rows;
        } catch(e) {
            console.error('Error reading data:', e);

            throw e;
        }
    }

    async updateData(query: string, params: string[] = []): Promise<void> {
        try {
            const db = await this.openConnection();
            const rows = await db.run(query, ...params);
        } catch(e) {
            console.error('Error reading data:', e);

            throw e;
        }
    }

    async deleteData(query: string, params: string[] = []): Promise<void> {
        try {
            const db = await this.openConnection();
            const rows = await db.run(query, ...params);
        } catch(e) {
            console.error('Error reading data:', e);

            throw e;
        }
    }
}
