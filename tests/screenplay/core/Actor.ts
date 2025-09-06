import { test } from "@playwright/test";
import { Ability } from "@interfaces/IAbility";
import { Question } from "@interfaces/IQuestion";
import { Task } from "@interfaces/ITask";
import { AllureLogger } from "@utils/AllureLogger";
import { TaskFailedError, QuestionValidationError } from "@errors/TestErrors";

export class Actor {
  private abilities = new Map<Function, Ability>();
  private static indent = "  "; 

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

  static startTestLog(testName: string) {
    console.info(`\n=== ${testName} ===\n`);
  }

  static endTestLog(testName: string) {
    console.info(`\n=== ${testName} ===\n\n`);
  }

  async attemptsTo(...tasks: Task[]) {
    return Promise.all(
      tasks.map((task) =>
        test.step(
          task.stepName?.() || `Task: ${task.constructor.name}`,
          async () => {
            const stepName = task.stepName?.() || task.constructor.name;
            const testName = test.info().title;
            console.info(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Iniciando Task: ${stepName}`
            );
            AllureLogger.info(`Iniciando Task: ${stepName}`);

            try {
              await task.performAs(this);
              console.info(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Task concluída: ${stepName}`
              );
              AllureLogger.info(`Task concluída: ${stepName}`);
            } catch (error) {
              console.error(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
                error
              );
              throw new TaskFailedError(stepName, (error as Error).message);
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
    const ErrorClass = options?.errorClass ?? QuestionValidationError;

    return test.step(
      question.stepName?.() || `Question: ${question.constructor.name}`,
      async () => {
        const stepName = question.stepName?.() || question.constructor.name;
        const testName = test.info().title;
        console.info(
          `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Respondendo Question: ${stepName}`
        );
        AllureLogger.info(`Respondendo Question: ${stepName}`);

        try {
          const result = await question.answeredBy(this);

          if (invalidValues.includes(result)) {
            const errorMessage =
              options?.errorMessage ??
              `Question "${stepName}" retornou valor inválido: ${result}`;
            console.error(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `
            );
            throw new ErrorClass(stepName, errorMessage);
          }

          console.info(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Question respondida: ${stepName}`
          );
          AllureLogger.info(`Question respondida: ${stepName}`);
          return result;
        } catch (error) {
          console.error(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
            error
          );
          throw error;
        }
      }
    );
  }
}
