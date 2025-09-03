import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { Question } from '@interfaces/IQuestion';

export class DoesDataExist implements Question<any> {
  private rows: any[];

  constructor(rows: any[]) {
    this.rows = rows;
  }

  static fromRows(rows: any[]) {
    return new DoesDataExist(rows);
  }

  async answeredBy(actor: Actor): Promise<any>{
    actor.abilityTo(AccessDatabase);
    return this.rows.length > 0;
  }
}
