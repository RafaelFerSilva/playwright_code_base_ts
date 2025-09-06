
import { Task } from "@interfaces/ITask";
import { Actor } from "@screenplay/core/Actor";
import { CallAnApi } from "../abilities/CallAnApi";

export class RegisterNewAccount implements Task {
  private constructor(
    private readonly userName: string,
    private readonly password: string
  ) {}

  static withCredentials(
    userName: string,
    password: string
  ): RegisterNewAccount {
    return new RegisterNewAccount(userName, password);
  }

  stepName(): string {
    return `Registrar nova conta para usuário: ${this.userName}`;
  }

  async performAs(actor: Actor): Promise<void> {
    const apiClient = actor.abilityTo(CallAnApi).client;
    try {
      const response = await apiClient.createUser({
        userName: this.userName,
        password: this.password,
      });

      // Armazenar resposta no contexto do ator para uso posterior
      (actor as any).lastUserCreationResponse = response;
    } catch (error) {
      throw error;
    }
  }
}
