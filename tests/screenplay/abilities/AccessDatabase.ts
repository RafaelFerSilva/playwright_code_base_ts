import { Ability } from '@interfaces/IAbility';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';

/**
 * Habilidade para acessar e manipular o banco de dados via um adapter.
 * Encapsula operações de conexão, execução de scripts e fechamento da conexão.
 */
export class AccessDatabase implements Ability {
  constructor(private adapter: IDatabaseAdapter) {}

  /**
   * Factory para criar a habilidade usando um adapter específico.
   * @param adapter Adapter que implementa a interface IDatabaseAdapter
   * @returns Instância da habilidade AccessDatabase
   */
  static using(adapter: IDatabaseAdapter): AccessDatabase {
    return new AccessDatabase(adapter);
  }

  /**
   * Estabelece conexão com o banco de dados.
   * @throws Erro caso a conexão falhe
   */
  async connect(): Promise<void> {
    try {
      await this.adapter.connect();
    } catch (error) {
      // Pode-se logar ou tratar o erro aqui antes de propagar
      throw new Error(`Falha ao conectar no banco: ${(error as Error).message}`);
    }
  }

  /**
   * Executa um script SQL a partir do caminho fornecido.
   * @param path Caminho do arquivo do script SQL
   * @returns Resultado da execução do script
   * @throws Erro caso a execução falhe
   */
  async executeScript(path: string): Promise<any> {
    try {
      return await this.adapter.executeScript(path);
    } catch (error) {
      throw new Error(`Falha ao executar script '${path}': ${(error as Error).message}`);
    }
  }

  /**
   * Substitui valores no script e executa.
   * @param path Caminho do arquivo do script SQL
   * @param values Valores para substituir no script
   * @returns Resultado da execução do script com valores substituídos
   * @throws Erro caso a execução falhe
   */
  async replaceValuesAndExecuteScript(path: string, values: string[]): Promise<any> {
    try {
      return await this.adapter.replaceValuesAndExecuteScript(path, values);
    } catch (error) {
      throw new Error(`Falha ao executar script com substituição '${path}': ${(error as Error).message}`);
    }
  }

  /**
   * Fecha a conexão com o banco de dados.
   * @throws Erro caso o fechamento da conexão falhe
   */
  async close(): Promise<void> {
    try {
      await this.adapter.closeConnection();
    } catch (error) {
      throw new Error(`Falha ao fechar conexão: ${(error as Error).message}`);
    }
  }
}
