import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { Task } from '@interfaces/ITask';

export class ExecuteSqlScript implements Task {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new ExecuteSqlScript(scriptPath);
  }

  async performAs(actor: Actor): Promise<void> {
    const db = actor.abilityTo(AccessDatabase);
    await db.executeScript(this.scriptPath);
  }
}