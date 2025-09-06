import { test, expect } from "@playwright/test";
import { Actor } from "@screenplay/core/Actor";
import { CallAnApi } from "@screenplay/abilities/CallAnApi";
import { DemoQAAccountApiAdapter } from "@adapters/DemoQAAccountApiAdapter";
import {
  UserCreationResponse,
  UserHasEmptyBooksList,
  UserHasValidId,
} from "@screenplay/questions/UserCreationResponse";
import { RegisterNewAccount } from "@screenplay/tasks/RegisterNewAccount";

test.describe("DemoQA Account API Tests - Screenplay Pattern", () => {
  let actor: Actor;
  let apiAdapter: DemoQAAccountApiAdapter;

  test.beforeEach(async ({ request }) => {
    apiAdapter = new DemoQAAccountApiAdapter(request);
    actor = new Actor("API Tester").whoCan(new CallAnApi(apiAdapter));
  });

  test("Must register a new user", async () => {
    const userName = `testuser_${Date.now()}`;
    const password = "784512Asd!";

    await actor.attemptsTo(
      RegisterNewAccount.withCredentials(userName, password)
    );

    // Verificar resultado usando Questions
    const hasValidUserName = await actor.asksFor(
      UserCreationResponse.hasValidUserName(userName)
    );

    const hasValidId = await actor.asksFor(new UserHasValidId());

    const hasEmptyBooks = await actor.asksFor(new UserHasEmptyBooksList());

    expect(hasValidUserName).toBe(true);
    expect(hasValidId).toBe(true);
    expect(hasEmptyBooks).toBe(true);
  });

  test("Should fail when trying to create user with invalid password", async () => {
    const userName = `invaliduser_${Date.now()}`;
    const invalidPassword = "123"; // Senha muito simples

    await expect(
      actor.attemptsTo(
        RegisterNewAccount.withCredentials(userName, invalidPassword)
      )
    ).rejects.toThrow();
  });

  test("Should fail when trying to create duplicate user", async () => {
    const userName = `duplicateuser_${Date.now()}`;
    const password = "784512Asd!";

    // Criar primeiro usuário
    await actor.attemptsTo(
      RegisterNewAccount.withCredentials(userName, password)
    );

    // Tentar criar usuário com mesmo nome deve falhar
    await expect(
      actor.attemptsTo(RegisterNewAccount.withCredentials(userName, password))
    ).rejects.toThrow();
  });

  test("Must validate complete structure of creation response", async () => {
    const userName = `structuretest_${Date.now()}`;
    const password = "784512Asd!";

    await actor.attemptsTo(
      RegisterNewAccount.withCredentials(userName, password)
    );

    // Múltiplas validações usando Questions
    const validations = await Promise.all([
      actor.asksFor(UserCreationResponse.hasValidUserName(userName)),
      actor.asksFor(new UserHasValidId()),
      actor.asksFor(new UserHasEmptyBooksList()),
    ]);

    const [hasValidName, hasValidId, hasEmptyBooks] = validations;

    expect(hasValidName).toBe(true);
    expect(hasValidId).toBe(true);
    expect(hasEmptyBooks).toBe(true);
  });
});
