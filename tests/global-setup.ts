import { DBConfig } from '@interfaces/IDbConfig';
import { getDatabaseInstance } from './adapters/DatabaseConnection';

const dbConfig: DBConfig = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
};

async function globalSetup() {
  const db = getDatabaseInstance(dbConfig);
  await db.connect();
  console.log('Database connected in globalSetup');
}

export default globalSetup;