import { Ability } from "@interfaces/IAbility";
import { Question } from "@interfaces/IQuestion";
import { Task } from "@interfaces/ITask";


export class Actor {
  private abilities = new Map<Function, Ability>();

  constructor(public name: string) {}

  whoCan(...abilities: Ability[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends Ability>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  attemptsTo(...tasks: Task[]) {
    return Promise.all(tasks.map(task => task.performAs(this)));
  }

  asksFor<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }
}
