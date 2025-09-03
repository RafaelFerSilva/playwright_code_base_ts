import * as allure from "allure-js-commons";

export class AllureLogger {
  static log(message: string) {
    allure.logStep(message);
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

  static attachment(name: string, content: string | Buffer, type: string) {
    // Anexa conteúdo ao relatório (ex: texto, JSON, imagem)
    allure.attachment(name, content, type);
  }

  static step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    // Cria um step Allure com tratamento automático de erros e logs
    const result = allure.step(name, async () => {
      try {
        return await fn();
      } catch (error) {
        this.error(`Erro no step "${name}": ${(error as Error).message}`);
        throw error;
      }
    });

    return Promise.resolve(result);
  }
}
