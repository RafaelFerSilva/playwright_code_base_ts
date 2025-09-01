import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { Question } from '@interfaces/IQuestion';

export class QueryDatabase implements Question<any[]> {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new QueryDatabase(scriptPath);
  }

  async answeredBy(actor: Actor): Promise<any[]> {
    const db = actor.abilityTo(AccessDatabase);
    const results = await db.executeScript(this.scriptPath);
    return results;
  }
}
