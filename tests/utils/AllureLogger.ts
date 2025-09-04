import { test } from '@playwright/test';

export class AllureLogger {
  static log(message: string) {
    test.step(message, async () => {});
  }

  static info(message: string) {
    this.log(`INFO: ${message}`);
  }

  static warn(message: string) {
    this.log(`WARN: ${message}`);
  }

  static error(message: string) {
    this.log(`ERROR: ${message}`);
  }

  static step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return test.step(name, async () => {
      try {
        return await fn();
      } catch (error) {
        this.error(`Erro no step "${name}": ${(error as Error).message}`);
        throw error;
      }
    });
  }
}
