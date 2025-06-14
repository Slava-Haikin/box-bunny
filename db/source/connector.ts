import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { rootDir } from '@/constants';

export class DatabaseConnector {
    private db: Database | null = null;
    private dbPath: string;

    constructor(private filename: string) {
        this.dbPath = join(rootDir, 'db', 'source', this.filename);
        const dbDir = join(rootDir, 'db', 'source');

        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
            console.info('Folder db/source was created');
        }
    }

    async checkConnection(): Promise<boolean> {
        if (!existsSync(this.dbPath)) {
            console.info('Database does not exist, it will be created');
        }

        try {
            const db = await open({
                filename: this.dbPath,
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
                filename: this.dbPath,
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

    async readData<T>(query: string, params: string[] = []): Promise<T[]> {
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
