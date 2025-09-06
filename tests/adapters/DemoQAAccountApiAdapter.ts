import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser, IUserCreationResponse } from "@interfaces/IUser";
import { APIRequestContext } from "@playwright/test";
import { ApiError } from "@errors/TestErrors";
import { AllureLogger } from "@utils/AllureLogger";

export class DemoQAAccountApiAdapter implements IAccountApiPort {
  private readonly baseUrl = 'https://demoqa.com/Account/v1';

  constructor(private readonly request: APIRequestContext) {}

  async createUser(user: IUser): Promise<IUserCreationResponse> {
    const endpoint = `${this.baseUrl}/User`;
    
    try {
      AllureLogger.info(`Enviando requisição para criar usuário: { username: ${user.userName} }`);

      const response = await this.request.post(endpoint, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          userName: user.userName,
          password: user.password
        }
      });

      const responseBody = await response.json();

      if (!response.ok()) {
        AllureLogger.error(`Falha na criação de usuário - Status: ${response.status()} - Detalhes: ${JSON.stringify(responseBody)}`);
        
        throw new ApiError(
          response.status(),
          endpoint,
          responseBody?.message || `HTTP ${response.status()}: ${JSON.stringify(responseBody)}`
        );
      }

      AllureLogger.info(`Usuário criado com sucesso via API: { username: ${responseBody.username}, userID: ${responseBody.userID} }`);

      return responseBody;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      AllureLogger.error(`Erro inesperado ao criar usuário: ${(error as Error).message}`);
      throw new ApiError(0, endpoint, `Unexpected error: ${(error as Error).message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const endpoint = `${this.baseUrl}/User/${userId}`;
    
    try {
      AllureLogger.info(`Enviando requisição para deletar usuário: { userID: ${userId} }`);

      const response = await this.request.delete(endpoint, {
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok()) {
        const responseBody = await response.json().catch(() => ({}));
        
        AllureLogger.error(`Falha ao deletar usuário - Status: ${response.status()} - Detalhes: ${JSON.stringify(responseBody)}`);
        
        throw new ApiError(
          response.status(),
          endpoint,
          responseBody?.message || `Failed to delete user: HTTP ${response.status()}`
        );
      }

      AllureLogger.success(`Usuário deletado com sucesso: { userID: ${userId} }`);

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      AllureLogger.error(`Erro inesperado ao deletar usuário: ${(error as Error).message}`);
      throw new ApiError(0, endpoint, `Unexpected error: ${(error as Error).message}`);
    }
  }

  async getUserInfo(userId: string): Promise<any> {
    const endpoint = `${this.baseUrl}/User/${userId}`;
    
    try {
      AllureLogger.success(`Enviando requisição para obter informações do usuário: { userID: ${userId} }`);

      const response = await this.request.get(endpoint, {
        headers: {
          'accept': 'application/json'
        }
      });

      const responseBody = await response.json();

      if (!response.ok()) {
        AllureLogger.error(`Falha ao obter informações do usuário - Status: ${response.status()} - Detalhes: ${JSON.stringify(responseBody)}`);
        
        throw new ApiError(
          response.status(),
          endpoint,
          responseBody?.message || `Failed to get user info: HTTP ${response.status()}`
        );
      }

      AllureLogger.success(`Informações do usuário obtidas com sucesso: ${JSON.stringify(responseBody)}`);

      return responseBody;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      AllureLogger.error(`Erro inesperado ao obter informações do usuário: ${(error as Error).message}`);
      throw new ApiError(0, endpoint, `Unexpected error: ${(error as Error).message}`);
    }
  }
}
