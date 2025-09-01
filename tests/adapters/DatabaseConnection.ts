import { DBConfig } from '@interfaces/IDbConfig';
import { MySQLAdapter } from './MySQLAdapter';

let instance: MySQLAdapter | null = null;

export function getDatabaseInstance(config: DBConfig): MySQLAdapter {
  if (!instance) {
    instance = new MySQLAdapter(config);
  }
  return instance;
}