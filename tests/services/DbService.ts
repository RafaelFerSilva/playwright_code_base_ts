import { MySQLAdapter } from '@adapters/MySQLAdapter';

export class DbService {
  constructor(private adapter: MySQLAdapter) {}

  async executeScript(scriptPath: string) {
    return await this.adapter.executeScript(scriptPath);
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]) {
    return await this.adapter.replaceValuesAndExecuteScript(scriptPath, values);
  }
}