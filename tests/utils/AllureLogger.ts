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

  static async attachment(name: string, content: string | Buffer, type: string) {
    const testInfo = test.info();
    if (testInfo) {
      await testInfo.attach(name, {
        body: typeof content === 'string' ? Buffer.from(content, 'utf-8') : content,
        contentType: type,
      });
    } else {
      console.warn(`Attachment "${name}" não anexado: fora do contexto do teste`);
    }
  }
}