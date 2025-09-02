import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';

export class DbService {
  constructor(private adapter: IDatabaseAdapter) {}

  async executeScript(scriptPath: string) {
    return await this.adapter.executeScript(scriptPath);
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]) {
    return await this.adapter.replaceValuesAndExecuteScript(scriptPath, values);
  }
}
