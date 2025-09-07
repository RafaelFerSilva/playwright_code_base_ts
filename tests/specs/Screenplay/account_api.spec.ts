import { DemoQAAccountApiAdapter } from "@adapters/DemoQAAccountApiAdapter";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { test, expect } from "@playwright/test";
import { CallAccountService } from "@screenplay/abilities/CallAccountService";
import { Actor } from "@screenplay/core/Actor";
import { ServiceValidationsWereApplied } from "@screenplay/questions/ServiceValidations";
import { CreateUserViaService } from "@screenplay/tasks/CreateUserViaService";
import { AccountService } from "@services/AccountService";

test.describe("DemoQA Account API Tests - Service Layer Architecture", () => {
  let actor: Actor;
  let accountService: IAccountApiPort;

  test.beforeEach(async ({ request }) => {
    // 1. Adapter (Infraestrutura - Comunicação HTTP)
    const apiAdapter = new DemoQAAccountApiAdapter(request);

    // 2. Service (Domínio - Lógica de Negócio)
    accountService = new AccountService(apiAdapter);

    // 3. Actor com habilidade de usar Service
    actor = Actor.named("API Tester").whoCan(
      CallAccountService.using(accountService)
    );
  });

  test("Deve registrar usuário usando Service com validações de negócio", async () => {
    const userName = `serviceuser_${Date.now()}`;
    const password = "784512Asd!";

    await actor.attemptsTo(
      CreateUserViaService.withCredentials(userName, password)
    );

    const validationsApplied = await actor.asksFor(
      ServiceValidationsWereApplied.for(userName)
    );

    expect(validationsApplied).toBe(true);

    // Verificação adicional dos dados básicos
    const response = (actor as any).lastUserCreationResponse;
    expect(response.username).toBe(userName);
    expect(response.userID).toBeTruthy();
  });

  test("Service deve validar senha inválida antes de chamar API", async () => {
    const userName = `invalidpass_${Date.now()}`;
    const invalidPassword = "123"; // Não atende critérios de negócio

    // Service deve falhar na validação antes mesmo de chamar o Adapter
    await expect(
      actor.attemptsTo(
        CreateUserViaService.withCredentials(userName, invalidPassword)
      )
    ).rejects.toThrow("Password deve ter pelo menos 6 caracteres");
  });

  test("Service deve validar username vazio antes de chamar API", async () => {
    const emptyUserName = "";
    const password = "784512Asd!";

    // Service deve falhar na validação de username vazio
    await expect(
      actor.attemptsTo(
        CreateUserViaService.withCredentials(emptyUserName, password)
      )
    ).rejects.toThrow("Username é obrigatório");
  });

  test("Deve falhar ao tentar criar usuário duplicado (validação via Service)", async () => {
    const userName = `duplicate_${Date.now()}`;
    const password = "784512Asd!";

    // Criar primeiro usuário
    await actor.attemptsTo(
      CreateUserViaService.withCredentials(userName, password)
    );

    // Tentar criar usuário duplicado deve falhar
    await expect(
      actor.attemptsTo(CreateUserViaService.withCredentials(userName, password))
    ).rejects.toThrow();
  });
});
