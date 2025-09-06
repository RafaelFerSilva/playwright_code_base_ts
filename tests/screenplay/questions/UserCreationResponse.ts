import { Actor } from "@screenplay/core/Actor";
import { IUserCreationResponse as UserResponse } from "@interfaces/IUser";
import { Question } from "@interfaces/IQuestion";

export class UserCreationResponse implements Question<boolean> {
  private constructor(
    private readonly expectedUserName: string,
    private readonly shouldHaveUserId: boolean = true
  ) {}

  static hasValidUserName(expectedUserName: string): UserCreationResponse {
    return new UserCreationResponse(expectedUserName, true);
  }

  static hasUserName(expectedUserName: string): UserCreationResponse {
    return new UserCreationResponse(expectedUserName, false);
  }

  stepName(): string {
    return `Verificar se resposta de criação de usuário é válida para: ${this.expectedUserName}`;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const response = (actor as any).lastUserCreationResponse as UserResponse;

    if (!response) {
      return false;
    }

    const hasValidUserName = response.username === this.expectedUserName;
    const hasValidUserId = this.shouldHaveUserId
      ? response.userID !== null &&
        response.userID !== undefined &&
        response.userID !== ""
      : true;

    const isValid = hasValidUserName && hasValidUserId;
    return isValid;
  }
}

export class UserHasValidId implements Question<boolean> {
  stepName(): string {
    return "Verificar se usuário possui ID válido";
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const response = (actor as any).lastUserCreationResponse as UserResponse;

    if (!response) {
      return false;
    }

    const hasValidId =
      response.userID !== null &&
      response.userID !== undefined &&
      response.userID !== "";

    return hasValidId;
  }
}

export class UserHasEmptyBooksList implements Question<boolean> {
  stepName(): string {
    return "Verificar se usuário possui lista de livros vazia";
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const response = (actor as any).lastUserCreationResponse as UserResponse;

    if (!response) {
      return false;
    }

    const hasEmptyBooks =
      Array.isArray(response.books) && response.books.length === 0;

    return hasEmptyBooks;
  }
}
