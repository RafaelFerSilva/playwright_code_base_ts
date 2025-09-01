import { test as base } from '@playwright/test';
import { MySQLAdapter } from '@adapters/MySQLAdapter';

const dbConfig = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
};

export const test = base.extend<
  {},
  {
    dbAdapter: MySQLAdapter
  }
>({
  dbAdapter: [
    async ({}, use) => {
      const db = new MySQLAdapter(dbConfig);
      await db.connect();
      await use(db);
      await db.closeConnection();
    }, { scope: 'worker' }],
});