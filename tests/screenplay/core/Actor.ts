import { test } from "@playwright/test";
import { Ability } from "@interfaces/IAbility";
import { Question } from "@interfaces/IQuestion";
import { Task } from "@interfaces/ITask";
import { AllureLogger } from "@utils/AllureLogger";

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

  async attemptsTo(...tasks: Task[]) {
    return Promise.all(
      tasks.map((task) =>
        test.step(
          task.stepName?.() || `Task: ${task.constructor.name}`,
          async () => {
            const stepName = task.stepName?.() || task.constructor.name;
            console.info(`[Actor: ${this.name}] Iniciando Task: ${stepName}`);
            AllureLogger.info(`Iniciando Task: ${stepName}`);

            try {
              await task.performAs(this);
              console.info(`[Actor: ${this.name}] Task concluída: ${stepName}`);
              AllureLogger.info(`Task concluída: ${stepName}`);
            } catch (error) {
              console.error(
                `[Actor: ${this.name}] Erro na Task: ${stepName}`,
                error
              );
              AllureLogger.error(
                `Erro na Task: ${stepName} - ${(error as Error).message}`
              );
              throw new Error(
                `[Actor: ${this.name}] Falha na Task "${stepName}": ${(error as Error).message}`
              );
            }
          }
        )
      )
    );
  }

  async asksFor<T extends string | number | boolean | null | undefined>(
    question: Question<T>,
    options?: QuestionValidationOptions<T>
  ): Promise<T> {
    const invalidValues =
      options?.invalidValues ?? ([false, null, undefined] as T[]);
    const ErrorClass = options?.errorClass ?? Error;

    return test.step(
      question.stepName?.() || `Question: ${question.constructor.name}`,
      async () => {
        const stepName = question.stepName?.() || question.constructor.name;
        console.info(`[Actor: ${this.name}] Respondendo Question: ${stepName}`);
        AllureLogger.info(`Respondendo Question: ${stepName}`);

        try {
          const result = await question.answeredBy(this);

          if (invalidValues.includes(result)) {
            const errorMessage =
              options?.errorMessage ??
              `Question "${stepName}" retornou valor inválido: ${result}`;
            console.error(`[Actor: ${this.name}] ${errorMessage}`);
            AllureLogger.error(errorMessage);
            throw new ErrorClass(errorMessage);
          }

          console.info(
            `[Actor: ${this.name}] Question respondida: ${stepName}`
          );
          AllureLogger.info(`Question respondida: ${stepName}`);
          return result;
        } catch (error) {
          console.error(
            `[Actor: ${this.name}] Erro na Question: ${stepName}`,
            error
          );
          AllureLogger.error(
            `Erro na Question: ${stepName} - ${(error as Error).message}`
          );
          throw error;
        }
      }
    );
  }
}
