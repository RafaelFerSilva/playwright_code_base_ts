import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { Question } from '@interfaces/IQuestion';

export class DoesDataExist implements Question<boolean> {
  private scriptPath: string;
  private values: string[];

  constructor(scriptPath: string, values: string[]) {
    this.scriptPath = scriptPath;
    this.values = values;
  }

  static fromFileWithValues(scriptPath: string, values: string[]) {
    return new DoesDataExist(scriptPath, values);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const db = actor.abilityTo(AccessDatabase);
    const { rows } = await db.replaceValuesAndExecuteScript(this.scriptPath, this.values);
    return rows.length > 0;
  }
}