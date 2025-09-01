import { Ability } from '@interfaces/IAbility';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';

export class AccessDatabase implements Ability {
  constructor(private adapter: IDatabaseAdapter) {}

  static using(adapter: IDatabaseAdapter) {
    return new AccessDatabase(adapter);
  }

  async connect() {
    await this.adapter.connect();
  }

  async executeScript(path: string) {
    return this.adapter.executeScript(path);
  }

  async replaceValuesAndExecuteScript(path: string, values: string[]) {
    return this.adapter.replaceValuesAndExecuteScript(path, values);
  }

  async close() {
    await this.adapter.closeConnection();
  }
}
